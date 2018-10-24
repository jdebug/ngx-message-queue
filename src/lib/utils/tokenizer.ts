import { DepthSplit } from './depth-split';

export class Tokenizer { 

	public static tokenizeExpression (expression: string): any {
	  var multiple = false;
	  
	  var booleanParts = DepthSplit.depthSplit(expression, /&|\|/, { includeDelimiters: true });
	  if (booleanParts.length > 1) {
	    var result = [
	      Tokenizer.getSelectPart(booleanParts[0].trim())
	    ];

	    for (var i = 1; i < booleanParts.length; i += 2) {
	      var part = Tokenizer.getSelectPart(booleanParts[i + 1].trim());
	      if (part) {
	        part.booleanOp = booleanParts[i];
	        result.push(part);
	      }
	    }

	    return {
	      multiple: multiple,
	      boolean: true,
	      select: result
	    }
	  } else {
	    var result1 = Tokenizer.getSelectPart(expression.trim());
	    if (!result1) {
	      return null;
	    } else {
	      return result1;
	    }
	  }
	}

	static getSelectPart (expPart: string): any {
	  var parts = DepthSplit.depthSplit(expPart, /(!)?(=|~|\:|<=|>=|<|>)/, { max: 2, includeDelimiters: true });
	  if (parts.length === 3) {
	    var negate = parts[1].charAt(0) === '!';
	    var key = Tokenizer.handleSelectPart(parts[0].trim());
	    var result = {
	      negate: negate,
	      op: negate ? parts[1].slice(1) : parts[1],
	      select: []
	    }
	    
	    if (result.op === '~') {
	      var value = Tokenizer.handleSelectPart(parts[2].trim());
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
	      result.select = [key, Tokenizer.handleSelectPart(parts[2].trim())];
	    }

	    return result;
	  }
	}

	static handleSelectPart(part: string): any {
	    return Tokenizer.paramToken(part);
	}

	static paramToken(text: string): any {
	  if (text.charAt(0) === '?'){
	    var num = parseInt(text.slice(1))
	    if (!isNaN(num)){
	      return {_param: num} ; 
	    } else {
	      return text;
	    }
	  } else {
	    return text;
	  }
	}
}