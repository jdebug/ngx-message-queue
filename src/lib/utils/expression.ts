
export class Expression { 

	public static eval (expression: any, headers: any): boolean {
	  if (expression == null) {
	    // if no filter then return true
	    return true;
	  } else if (expression.select) {
	    if (headers) {
	      var match = Expression.getParts(expression)

	      if (Expression.matches(headers, match)) {
	        return true;
	      } else {
	      	return false;
	      }
	    } else {
	      return true;
	    }
	  } 
	}

	static getParts(expression): any {
	  var match = (expression.boolean ? expression.select : [expression]).map(subExp => {
	          return subExp.boolean ? {
	            booleanOp: subExp.booleanOp,
	            op: subExp.op,
	            subPart: Expression.getParts(subExp)
	           } :
	           {
	            key: subExp.select[0],
	            value: subExp.select[1],
	            negate: subExp.negate,
	            booleanOp: subExp.booleanOp,
	            op: subExp.op
	          }
	      });

	  return match;
	}

	static matches (headers: any, parts: any): boolean {
	  var result = false;
	  
	  for (var i = 0; i < parts.length; i++) {
	    var opts = parts[i];
	    var r = false;

	    if (opts.subPart) {
	     r = Expression.matches(headers, opts.subPart);
	    } else {
		    if (opts.op === '=') {
		      if ((headers[opts.key] === true && opts.value === 'true') 
		      	|| (headers[opts.key] === false && opts.value === 'false')) {
		        r = true;
		      } else {
		        r = headers[opts.key] == opts.value;
		      }
		    } else if (opts.op === '>') {
		      r = headers[opts.key] > opts.value;
		    } else if (opts.op === '<') {
		      r = headers[opts.key] < opts.value;
		    } else if (opts.op === '>=') {
		      r = headers[opts.key] >= opts.value;
		    } else if (opts.op === '<=') {
		      r = headers[opts.key] <= opts.value;
		    }
		}

	    if (opts.negate) {
	      r = !r;
	    }

	    if (opts.booleanOp === '&') {
	      result = result && r;
	    } else if (opts.booleanOp === '|') {
	      result = result || r;
	    } else {
	      result = r;
	    }
	  }

	  return result;
	}
}