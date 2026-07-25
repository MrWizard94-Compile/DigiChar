// Shunting-Yard Mathematical Interpreter with Variable Context Mapping
// Replicating Rust DigiChar Engine logic in TypeScript

export enum TokenKind {
  Number = "Number",
  Variable = "Variable",
  Add = "Add",
  Subtract = "Subtract",
  Multiply = "Multiply",
  Divide = "Divide",
  LeftParen = "LeftParen",
  RightParen = "RightParen",
}

export interface Token {
  kind: TokenKind;
  value?: number;
  name?: string;
}

export class ShuntingYardEngine {
  static tokenize(expr: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < expr.length) {
      const c = expr[i];

      if (/\s/.test(c)) {
        i++;
        continue;
      }

      if (c === '+') { tokens.push({ kind: TokenKind.Add }); i++; continue; }
      if (c === '-') { tokens.push({ kind: TokenKind.Subtract }); i++; continue; }
      if (c === '*') { tokens.push({ kind: TokenKind.Multiply }); i++; continue; }
      if (c === '/') { tokens.push({ kind: TokenKind.Divide }); i++; continue; }
      if (c === '(') { tokens.push({ kind: TokenKind.LeftParen }); i++; continue; }
      if (c === ')') { tokens.push({ kind: TokenKind.RightParen }); i++; continue; }

      if (/[0-9.]/.test(c)) {
        let numStr = "";
        while (i < expr.length && /[0-9.]/.test(expr[i])) {
          numStr += expr[i];
          i++;
        }
        const decimalCount = [...numStr].filter((char) => char === '.').length;
        if (decimalCount > 1 || numStr === ".") {
          throw new Error("Malformed mathematical digit configuration");
        }
        const val = parseFloat(numStr);
        if (isNaN(val)) throw new Error("Malformed mathematical digit configuration");
        tokens.push({ kind: TokenKind.Number, value: val });
        continue;
      }

      if (/[a-zA-Z_]/.test(c)) {
        let varStr = "";
        while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) {
          varStr += expr[i];
          i++;
        }
        tokens.push({ kind: TokenKind.Variable, name: varStr });
        continue;
      }

      throw new Error(`Forbidden token expression vector injection rejected: ${c}`);
    }

    return tokens;
  }

  static evaluate(expr: string, variables: Record<string, number> = {}): number {
    const tokens = this.tokenize(expr);
    const outputQueue: Token[] = [];
    const operatorStack: Token[] = [];

    const precedence = (t: Token) => {
      if (t.kind === TokenKind.Multiply || t.kind === TokenKind.Divide) return 2;
      if (t.kind === TokenKind.Add || t.kind === TokenKind.Subtract) return 1;
      return 0;
    };

    for (const token of tokens) {
      if (token.kind === TokenKind.Number) {
        outputQueue.push(token);
      } else if (token.kind === TokenKind.Variable) {
        const varName = token.name!;
        if (!(varName in variables)) {
          throw new Error(`Variable tracking identifier out of context: ${varName}`);
        }
        outputQueue.push({ kind: TokenKind.Number, value: variables[varName] });
      } else if (
        token.kind === TokenKind.Add ||
        token.kind === TokenKind.Subtract ||
        token.kind === TokenKind.Multiply ||
        token.kind === TokenKind.Divide
      ) {
        while (operatorStack.length > 0) {
          const top = operatorStack[operatorStack.length - 1];
          if (top.kind === TokenKind.LeftParen) break;
          if (precedence(top) >= precedence(token)) {
            outputQueue.push(operatorStack.pop()!);
          } else {
            break;
          }
        }
        operatorStack.push(token);
      } else if (token.kind === TokenKind.LeftParen) {
        operatorStack.push(token);
      } else if (token.kind === TokenKind.RightParen) {
        let matched = false;
        while (operatorStack.length > 0) {
          const top = operatorStack.pop()!;
          if (top.kind === TokenKind.LeftParen) {
            matched = true;
            break;
          }
          outputQueue.push(top);
        }
        if (!matched) throw new Error("Mismatched algebraic functional encapsulation boundaries");
      }
    }

    while (operatorStack.length > 0) {
      const top = operatorStack.pop()!;
      if (top.kind === TokenKind.LeftParen || top.kind === TokenKind.RightParen) {
        throw new Error("Mismatched functional parentheses execution boundary error");
      }
      outputQueue.push(top);
    }

    // Evaluate RPN
    const stack: number[] = [];
    for (const token of outputQueue) {
      if (token.kind === TokenKind.Number) {
        stack.push(token.value!);
      } else {
        const r = stack.pop();
        const l = stack.pop();
        if (l === undefined || r === undefined) {
          throw new Error("Empty computation stack layout matrix trace error");
        }
        let res = 0;
        if (token.kind === TokenKind.Add) res = l + r;
        else if (token.kind === TokenKind.Subtract) res = l - r;
        else if (token.kind === TokenKind.Multiply) res = l * r;
        else if (token.kind === TokenKind.Divide) {
          if (r === 0) throw new Error("Zero division vector tracking evaluation caught");
          res = l / r;
        }
        stack.push(res);
      }
    }

    if (stack.length !== 1) {
      throw new Error("Incomplete parsing transformation stack convergence failure");
    }

    return Math.round(stack[0] * 100) / 100;
  }
}

export interface TrendSummary {
  currentPeriodSpendCents: number;
  priorPeriodSpendCents: number;
  deltaPercentage: number;
  highSalienceColorToken: "SAL_CRITICAL_RED" | "SAL_WARNING_ORANGE" | "SAL_OPTIMAL_GREEN" | "SAL_NEUTRAL_MUTED";
}

export class TrendEngine {
  static calculateMovingTrend(
    expenses: { amountCents: number; timestamp: Date }[],
    windowDays: number,
    currentTime: Date = new Date()
  ): TrendSummary {
    const periodMs = windowDays * 86400 * 1000;
    const currentStartMs = currentTime.getTime() - periodMs;
    const priorStartMs = currentStartMs - periodMs;

    let currentSpend = 0;
    let priorSpend = 0;

    for (const tx of expenses) {
      const txMs = tx.timestamp.getTime();
      if (txMs >= currentStartMs && txMs <= currentTime.getTime()) {
        currentSpend += tx.amountCents;
      } else if (txMs >= priorStartMs && txMs < currentStartMs) {
        priorSpend += tx.amountCents;
      }
    }

    let deltaPercentage = 0;
    if (priorSpend === 0) {
      deltaPercentage = currentSpend === 0 ? 0 : 100;
    } else {
      deltaPercentage = ((currentSpend - priorSpend) / priorSpend) * 100;
    }

    let highSalienceColorToken: TrendSummary["highSalienceColorToken"] = "SAL_NEUTRAL_MUTED";
    if (deltaPercentage > 15) {
      highSalienceColorToken = "SAL_CRITICAL_RED";
    } else if (deltaPercentage > 5) {
      highSalienceColorToken = "SAL_WARNING_ORANGE";
    } else if (deltaPercentage < -5) {
      highSalienceColorToken = "SAL_OPTIMAL_GREEN";
    }

    return {
      currentPeriodSpendCents: currentSpend,
      priorPeriodSpendCents: priorSpend,
      deltaPercentage: Math.round(deltaPercentage * 10) / 10,
      highSalienceColorToken,
    };
  }
}
