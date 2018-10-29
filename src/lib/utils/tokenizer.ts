import { DepthSplit } from './depth-split';

export class Tokenizer { 

	public static tokenize (expression: string): any {
	  var multiple = false;
	  
	  var expParts = DepthSplit.depthSplit(expression, /&|\|/, { includeDelimiters: true });

	  if (expParts.length > 1) {
	  	var exp = expParts[0].trim();
	    var result = [
	      Tokenizer.enclosedByParenthesis(exp) ? Tokenizer.tokenize(exp.slice(1, exp.length-1)) : Tokenizer.tokenizeParts(exp)
	    ];

	    for (var i = 1; i < expParts.length; i += 2) {
	      var exp = expParts[i + 1].trim();
      	  var part = Tokenizer.enclosedByParenthesis(exp) ? Tokenizer.tokenize(exp.slice(1, exp.length-1)) : Tokenizer.tokenizeParts(exp);
	      if (part) {
	        part.booleanOp = expParts[i];
	        result.push(part);
	      }
	    }

	    return {
	      multiple: multiple,
	      boolean: true,
	      select: result
	    }
	  } else {
	  	var result1 = Tokenizer.enclosedByParenthesis(expression.trim()) ? Tokenizer.tokenize(expression.trim().slice(1, expression.trim().length-1)) : Tokenizer.tokenizeParts(expression.trim());
	    if (!result1) {
	      return null;
	    } else {
	      return result1;
	    }
	  }
	}

	static tokenizeParts (expPart: string): any {
	  var parts = DepthSplit.depthSplit(expPart, /(!)?(=|~|\:|<=|>=|<|>)/, { max: 2, includeDelimiters: true });
	  if (parts.length === 3) {
	    var negate = parts[1].charAt(0) === '!';
	    var key = parts[0].trim();
	    var result = {
	      negate: negate,
	      op: negate ? parts[1].slice(1) : parts[1],
	      select: []
	    }
	    
	    if (result.op === '~') {
	      var value = parts[2].trim();
	      if (typeof value === 'string') {
	        var reDef = parts[2].trim().match(/^\/(.*)\/([a-z]?)$/);
	        if (reDef) {
	          result.select = [key, new RegExp(reDef[1], reDef[2])];
	        } else {
	          result.select = [key, value];
	        }
	      } else {
	        result.select = [key, value];
	      }
	    } else {
	      result.select = [key, parts[2].trim()];
	    }

	    return result;
	  }
	}

	static enclosedByParenthesis(exp): boolean {
	  var openParenthesis = exp.charAt(0) === '(';
	  var closeParenthesis = exp.charAt(exp.length-1) === ')';
	  
	  if (openParenthesis && closeParenthesis) {
	    return true;
	  }

	  return false;
	}
}