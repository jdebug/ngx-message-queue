
export class Expression { 

	public static eval (expression: any, headers: any): boolean {
	  if (expression == null) {
	    // if no filter then return true
	    return true;
	  } else if (expression.select) {
	    if (headers) {
	      var match = (expression.boolean ? expression.select : [expression]).map(part => {
	          return {
	            key: part.select[0],
	            value: part.select[1],
	            negate: part.negate,
	            booleanOp: part.booleanOp,
	            op: part.op
	          }
	      });

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

	static matches (headers: any, parts: any): boolean {
	  var result = false;
	  
	  for (var i = 0; i < parts.length; i++) {
	    var opts = parts[i];
	    var r = false;
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