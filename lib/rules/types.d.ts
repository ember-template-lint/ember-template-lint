import { AST } from 'ember-template-recast';
import type Base from './_base';
export type Nodes = AST;
type PathParam = {
  parents(): Array<PathParam>;
  parent: PathParam;
  node: AST.Node;
  parentNode: AST.Node;
  parentKey: string;
};
type VisitFn<T extends AST.Node, R extends Base> = (this: R, node: T, path: PathParam) => void;
type NodeVisitor<T extends AST.Node, R extends Base> =
  | VisitFn<T, R>
  | { enter?: VisitFn<T, R>; exit?: VisitFn<T, R> };

export interface VisitorReturnType<R extends Base> {
  Template?: NodeVisitor<AST.Template, R>;
  Block?: NodeVisitor<AST.Block, R>;
  ElementNode?: NodeVisitor<AST.ElementNode, R>;
  TextNode?: NodeVisitor<AST.TextNode, R>;
  ConcatStatement?: NodeVisitor<AST.ConcatStatement, R>;
  StringLiteral?: NodeVisitor<AST.StringLiteral, R>;
  UndefinedLiteral?: NodeVisitor<AST.UndefinedLiteral, R>;
  BooleanLiteral?: NodeVisitor<AST.BooleanLiteral, R>;
  AttrNode?: NodeVisitor<AST.AttrNode, R>;
  PathExpression?: NodeVisitor<AST.PathExpression, R>;
  HashPair?: NodeVisitor<AST.HashPair, R>;
  MustacheStatement?: NodeVisitor<AST.MustacheStatement, R>;
  BlockStatement?: NodeVisitor<AST.BlockStatement, R>;
  ElementModifierStatement?: NodeVisitor<AST.ElementModifierStatement, R>;
  PartialStatement?: NodeVisitor<AST.PartialStatement, R>;
  CommentStatement?: NodeVisitor<AST.CommentStatement, R>;
  MustacheCommentStatement?: NodeVisitor<AST.MustacheCommentStatement, R>;
  SubExpression?: NodeVisitor<AST.SubExpression, R>;
}
