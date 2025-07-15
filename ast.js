/*
@Author: Aloha
@Time: 2025/7/15 19:19
@ProjectName: jd_ast
@FileName: ast.py
@Software: PyCharm
*/

const vm = require('vm');
const files = require('fs');
const {minify} = require("terser");
const types = require("@babel/types");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;


class JinDong {
    constructor(file_path) {
        this.ast = parser.parse(files.readFileSync(file_path, "utf-8"));
        this.vmpStr = null;
    }

    save_file() {
        const {code: newCode} = generator(this.ast);
        files.writeFileSync(
            './decode.js',
            newCode,
            "utf-8"
        );
    }

    hne() {
        let a = function (node) {
            if (types.isNumericLiteral(node)) return true;
            if (types.isUnaryExpression(node)) return a(node.argument);
            if (types.isBinaryExpression(node)) {
                return a(node.left) && a(node.right);
            }
            return false;
        };
        traverse(this.ast, {
            Literal(path) {
                let {parentPath, node} = path;
                if (!types.isNumericLiteral(node)) return;
                if (typeof node.extra?.raw !== "string") return;
                if (!node.extra.raw.includes('0x')) return;
                try {
                    const decoded = eval(node.extra.raw);
                    path.replaceWith(types.numericLiteral(decoded));
                    path.skip();
                } catch (e) {
                }
            }
        });
        traverse(this.ast, {
            BinaryExpression(path) {
                if (!a(path.node)) return;

                const code = generator(path.node).code;
                try {
                    const result = eval(code);
                    let b = result === 1 ? types.parenthesizedExpression(types.numericLiteral(result)) : types.numericLiteral(result);
                    path.replaceWith(b)
                } catch (e) {
                    console.log("Eval failed:", code);
                }
            }
        });
    }

    nos() {
        let a, b, c, d, e, f = [];
        a = function (arr) {
            const counts = {};
            let maxCount = 0;
            let mostFrequent = null;

            arr.forEach(item => {
                counts[item] = (counts[item] || 0) + 1;
                if (counts[item] > maxCount) {
                    maxCount = counts[item];
                    mostFrequent = item;
                }
            });

            return mostFrequent;
        };
        traverse(this.ast, {
            CallExpression: (path) => {
                let {callee, arguments: args} = path.node;
                if (!types.isIdentifier(callee)) return;
                if (args.length !== 1) return;
                if (!types.isStringLiteral(args[0])) return;
                f.push(callee.name);
            }
        });
        b = a(f);
        traverse(this.ast, {
            FunctionDeclaration: (path) => {
                let {id, params, body} = path.node;
                if (id.name !== b) return;
                if (params.length !== 1) return;
                c = generator(path.node).code;
                d = c + '\n' + b;
                path.remove()
            }
        });
        traverse(this.ast, {
            CallExpression: (path) => {
                let {callee, arguments: args} = path.node;
                if (!types.isIdentifier(callee)) return;
                if (callee.name !== b) return;
                if (args.length !== 1) return;
                if (!types.isStringLiteral(args[0])) return;
                e = eval(d + `("${args[0].value}")`);
                path.replaceWith(types.stringLiteral(e))
            }
        });
    }

    nlg() {
        traverse(this.ast, {
            VariableDeclarator: (path) => {
                let {id, init} = path.node;
                if (!types.isIdentifier(id)) return;
                if (!types.isArrayExpression(init)) return;
                if (init.elements.length === 0) return;
                this.vmpStr = init.elements.map(r => {
                    return r.value
                });
                path.stop()
            }
        })
    }

    fph() {
        let a, b, c, d, e, f, g, h, i, j, k = '\n', l, m, n, o, p, q;
        traverse(this.ast, {
            FunctionDeclaration: (path) => {
                let {id, params, body} = path.node;
                if (id === null) return;
                if (params.length !== 0) return;
                if (!types.isVariableDeclaration(body.body[0])) return;
                if (!types.isArrayExpression(body.body[0].declarations[0].init)) return;
                a = generator(path.node).code;
                b = id.name;
                q = path.node;
                // path.remove()
            }
        });
        traverse(this.ast, {
            FunctionDeclaration: (path) => {
                let {id, params, body} = path.node;
                if (id === null) return;
                if (params.length === 0) return;
                if (body.body.length !== 2) return;
                if (!types.isVariableDeclaration(body.body[0])) return;
                if (!types.isCallExpression(body.body[0].declarations[0].init)) return;
                if (body.body[0].declarations[0].init.callee.name !== b) return;
                if (!types.isReturnStatement(body.body[1])) return;
                c = generator(path.node).code;
                d = id.name;
                // path.remove()
            }
        });
        traverse(this.ast, {
            CallExpression: (path) => {
                let {parentPath, node} = path;
                if (!types.isExpressionStatement(parentPath.node)) return;
                let {callee, arguments: args} = node;
                if (!types.isFunctionExpression(callee)) return;
                if (args.length !== 2) return;
                e = callee.body.body[0].declarations[1].id;
                f = types.functionDeclaration(types.identifier('g'), callee.params, callee.body, false);
                f.body.body.push(types.returnStatement(e));
                g = generator(f).code;
                h = a + k + c + k + g + k + `g(${args[0].name},${args[1].value})`;
                i = eval(h);
                j = i.map(item => types.valueToNode(item));
                l = types.functionDeclaration(types.identifier(b), [], types.blockStatement([types.returnStatement(types.arrayExpression(j))]));
                m = generator(l).code;
                n = m + k + c + k + d;
                callee.body.body = callee.body.body.slice(0, -1);
                q.body.body[0].declarations[0].init = types.arrayExpression(j);
                parentPath.remove()
            }
        });
        traverse(this.ast, {
            CallExpression: (path) => {
                let {callee, arguments: args} = path.node;
                if (!types.isIdentifier(callee)) return;
                if (callee.name.includes('$')) return;
                if (args.length !== 1) return;
                if (!types.isNumericLiteral(args[0])) return;
                o = n + `(${args[0].value})`;
                try {
                    p = eval(o);
                } catch (e) {
                }
                path.replaceWith(types.stringLiteral(p))
            }
        });
    }

    nis(t, u, v) {
        let a, b, c, d, e, f = false;
        traverse(this.ast, {
            CallExpression: (path) => {
                let {callee, arguments: args} = path.node;
                if (!types.isMemberExpression(callee)) return;
                if (args.length === 0) return;
                let {object, property} = callee;
                if (!types.isIdentifier(object)) return;
                if (object.name !== v) return;
                if (!types.isIdentifier(property)) return;
                if (property.name !== u) return;
                let {key, value} = t.node;
                if (!types.isBinaryExpression(value.body.body[0].argument)) {
                    if (types.isLogicalExpression(value.body.body[0].argument)) {
                        d = value.body.body[0].argument;
                        e = types.logicalExpression(d.operator, args[0], args[1]);
                        path.replaceWith(e);
                        f = true;
                        return;
                    }
                    c = types.callExpression(args[0], args.slice(1));
                    path.replaceWith(c);
                    f = true;
                    return;
                }
                a = value.body.body[0].argument;
                b = types.binaryExpression(a.operator, args[0], args[1]);
                path.replaceWith(b);
                f = true;
            }
        });
        return f
    }

    kge(t, u, v) {
        let a = false;
        traverse(this.ast, {
            MemberExpression: (path) => {
                let {object, property} = path.node;
                if (!types.isIdentifier(object)) return;
                if (object.name !== v) return;
                if (!types.isIdentifier(property)) return;
                if (property.name !== u) return;
                path.replaceWith(t.node.value);
                a = true
            }
        });
        return a
    }

    ydo() {
        let a, b, c, d, e, f;
        traverse(this.ast, {
            VariableDeclarator: (path) => {
                let {id, init} = path.node;
                if (!types.isIdentifier(id)) return;
                if (!types.isObjectExpression(init)) return;
                if (init.properties.length === 0) return;
                if (init.properties[0].key.value === 'exports') return;
                a = init.properties;
                b = 0;
                while (b < a.length) {
                    c = path.get(`init.properties.${b}`);
                    d = c.node.key.value;
                    if (types.isFunctionExpression(c.node.value)) {
                        if (!types.isReturnStatement(c.node.value.body.body[0])) {
                            b++;
                            continue;
                        }
                        e = this.nis(c, d, id.name);
                        e && !this.vmpStr.includes(d) ? c.remove() : b++;
                        continue
                    }
                    f = this.kge(c, d, id.name);
                    f && !this.vmpStr.includes(d) ? c.remove() : b++
                }
            }
        });
    }

    start() {
        this.hne();
        this.nos();
        this.nlg();
        this.fph();
        this.ydo();
        this.save_file();
    }

}

console.time('处理完毕，耗时');

let jd_ast = new JinDong('./fullcode.js');
jd_ast.start();


console.timeEnd('处理完毕，耗时');

