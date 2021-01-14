#!/usr/bin/env bash

# Outputs a sorted list of lint violations by rule.
# Inspired by this: https://macr.ae/article/counting-eslint-disabled

# Example output:
#
# DISABLED ESLINT RULES:
#  40 ember/closure-actions
#  35 ember/no-jquery
#  33 ember/no-observers
#   5 complexity
#   2 no-console
# DISABLED EMBER-TEMPLATE-LINT RULES:
#  21 no-bare-strings
#   4 require-valid-alt-text
#   4 no-inline-styles
#   3 table-groups
# DISABLED STYLELINT RULES:
#  14 declaration-no-important
#   2 length-zero-no-unit

if [ "$#" -eq 0 ]; then
    echo "You must enter at least one command line argument with the path to search."
    exit 1
fi

# These regexps are used to remove all characters and whitespace surrounding the rule names in the disable directive comment.

# /* eslint-disable-line no-console */
# /* eslint-disable-line no-console -- explanation of why it is disabled */
# // eslint-disable-line no-console, no-empty
REGEXP_C_STYLE_COMMENT_SHELL='^.*\/[*\/] +| +\*\/|, *| +--.+| +$'

# {{! template-lint-disable no-bare-strings no-negated-condition }}
# {{!-- template-lint-disable no-bare-strings --}}
REGEXP_HBS_STYLE_COMMENT_SHELL='^.*{{!-{0,2} *| *-{0,2}}}.*$'

function countViolations () {
    declare file_type=$1
    declare disable_directive=$2
    declare regexp_comment_shell=$3
    declare header_to_print=$4
    declare path_to_search=$5

    echo "$header_to_print"

    grep -r \
        --include="$file_type" \
        --exclude-dir={dist,node_modules,vendor,tmp} \
        -h \
        "$disable_directive" \
        "$path_to_search" |                    # Find all lines containing the disable directive
        sed -E "s/$regexp_comment_shell//g" |  # Remove everything but the rule names
        tr ' ' '\n' |                          # Put every word on own line
        grep -v "$disable_directive" |         # Remove every line containing the disable directive
        sort |                                 # Sort rules so the same rule is grouped together
        uniq -c |                              # Count number of occurrences of each rule
        sort -bgr                              # Sort by number of occurrences from most to least
}

countViolations "*.js" "eslint-disable" "$REGEXP_C_STYLE_COMMENT_SHELL" "DISABLED ESLINT RULES:" $@
countViolations "*.hbs" "template-lint-disable" "$REGEXP_HBS_STYLE_COMMENT_SHELL" "DISABLED EMBER-TEMPLATE-LINT RULES:" $@
countViolations "*.scss" "stylelint-disable" "$REGEXP_C_STYLE_COMMENT_SHELL" "DISABLED STYLELINT RULES:" $@
