import { AST, Syntax } from 'ember-template-recast';
import type Base from './_base.js';
export type Nodes = AST;
type PathParam<T extends AST.Node> = {
  parents(): Array<PathParam>;
  parent: PathParam;
  node: T;
  parentNode: T;
  parentKey: string;
};
type VisitFn<T extends AST.Node, R extends Base, P extends AST.Node> = (
  this: R,
  node: T,
  path: PathParam<P>
) => void;
type LowerVisitor<T extends AST.Node, R extends Base, P extends AST.Node = AST.Node> = {
  before?: VisitFn<T, R, P>;
  after?: VisitFn<T, R, P>;
};
type NodeVisitor<T extends AST.Node, R extends Base, P extends AST.Node = AST.Node> =
  | VisitFn<T, R, P>
  | {
      enter?: VisitFn<T, R, P> | LowerVisitor<T, R, P>;
      exit?: VisitFn<T, R, P> | LowerVisitor<T, R, P>;
    };

type ElementVisitor<T extends AST.Node, R extends Base, P extends AST.Node = AST.Node> =
  | VisitFn<T, R, P>
  | {
      enter?: VisitFn<T, R, P> | LowerVisitor<T, R, P>;
      exit?: VisitFn<T, R, P> | LowerVisitor<T, R, P>;
      keys?: {
        children?: NodeVisitor<T, R, P>;
        comments?: NodeVisitor<T, R, P>;
      };
    };

type AnnotatedAttr = ReturnType<Syntax['builders']['attr']>;
type AnnotatedString = ReturnType<Syntax['builders']['string']>;

export interface VisitorReturnType<R extends Base> {
  Template?: NodeVisitor<AST.Template, R>;
  Block?: NodeVisitor<AST.Block, R, AST.BlockStatement>;
  ElementNode?: ElementVisitor<AST.ElementNode, R>;
  TextNode?: NodeVisitor<AST.TextNode, R>;
  ConcatStatement?: NodeVisitor<AST.ConcatStatement, R, AnnotatedAttr>;
  StringLiteral?: NodeVisitor<AnnotatedString, R>;
  UndefinedLiteral?: NodeVisitor<AST.UndefinedLiteral, R>;
  BooleanLiteral?: NodeVisitor<AST.BooleanLiteral, R>;
  AttrNode?: NodeVisitor<AnnotatedAttr, R, AST.ElementNode>;
  PathExpression?: NodeVisitor<
    AST.PathExpression,
    R,
    AST.SubExpression | AST.BlockStatement | AST.MustacheStatement | AST.ElementModifierStatement
  >;
  HashPair?: NodeVisitor<AST.HashPair, R, AST.Hash>;
  MustacheStatement?: NodeVisitor<
    AST.MustacheStatement,
    R,
    AnnotatedAttr | AST.ConcatStatement | AST.Block | AST.ElementNode
  >;
  BlockStatement?: NodeVisitor<AST.BlockStatement, R, AST.Block | AST.ElementNode | AST.Template>;
  ElementModifierStatement?: NodeVisitor<AST.ElementModifierStatement, R, AST.ElementNode>;
  PartialStatement?: NodeVisitor<AST.PartialStatement, R>;
  CommentStatement?: NodeVisitor<
    AST.CommentStatement,
    R,
    AST.BlockStatement | AST.ElementNode | AST.Template
  >;
  MustacheCommentStatement?: NodeVisitor<
    AST.MustacheCommentStatement,
    R,
    AST.BlockStatement | AST.ElementNode | AST.Template
  >;
  SubExpression?: NodeVisitor<
    AST.SubExpression,
    R,
    AST.SubExpression | AST.BlockStatement | AST.MustacheStatement | AST.ElementModifierStatement
  >;
}
