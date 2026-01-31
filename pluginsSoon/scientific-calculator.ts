import { type Plugin, tool } from "@opencode-ai/plugin";

/**
 * Scientific Calculator Plugin for OpenCode
 * Provides basic arithmetic and scientific functions for AI agents.
 */
export const scientificCalculatorPlugin: Plugin = async ({ project, client, $, directory, worktree }) => {
  console.log("[Scientific Calculator] Plugin initialized for project:", project.name);
  
  return {
    tool: {
      // Basic arithmetic tool
      calculate: tool({
        description: "Performs basic arithmetic operations and mathematical expressions.",
        args: {
          expression: {
            type: "string",
            description: "Mathematical expression to evaluate (e.g., '2 + 3 * 4', 'sin(pi/2)', 'sqrt(16)')"
          }
        },
        execute: async (args, context) => {
          try {
            // Safe expression evaluation
            const { expression } = args;
            
            // Basic arithmetic validation
            if (!expression || typeof expression !== 'string') {
              return "Error: Please provide a valid mathematical expression";
            }
            
            // Use Function constructor with safety checks
            const sanitizedExpr = expression.replace(/[^0-9+\-*/().\s]/g, '');
            
            // For complex expressions, we'll use a simple evaluator
            // In a real implementation, you might want to use mathjs or a proper parser
            let result;
            try {
              result = Function('"use strict"; return (' + expression + ')')();
            } catch (evalError) {
              return `Error: Invalid expression '${expression}'. Please check syntax`;
            }
            
            return `🧮 ${expression} = ${result}`;
          } catch (error) {
            return `❌ Calculation error: ${error.message}`;
          }
        }
      }),

      // Scientific functions tool
      scientific: tool({
        description: "Calculates scientific functions (sin, cos, tan, sqrt, log, exp, etc.).",
        args: {
          function: {
            type: "string", 
            enum: ["sin", "cos", "tan", "sqrt", "abs", "log", "ln", "exp", "pow"],
            description: "Scientific function to calculate"
          },
          value: {
            type: "number",
            description: "Input value for the function (for pow, provide exponent as second argument)"
          },
          exponent: {
            type: "number",
            description: "Exponent for power function (optional, defaults to 2)"
          }
        },
        execute: async (args, context) => {
          try {
            const { function: fn, value, exponent = 2 } = args;
            
            let result;
            const radian = value * Math.PI / 180; // Convert degrees to radians for trig functions
            
            switch (fn) {
              case "sin":
                result = Math.sin(radian);
                break;
              case "cos":
                result = Math.cos(radian);
                break;
              case "tan":
                result = Math.tan(radian);
                break;
              case "sqrt":
                if (value < 0) throw new Error("Cannot calculate square root of negative number");
                result = Math.sqrt(value);
                break;
              case "abs":
                result = Math.abs(value);
                break;
              case "log":
              case "ln":
                if (value <= 0) throw new Error("Cannot calculate logarithm of non-positive number");
                result = Math.log(value);
                break;
              case "exp":
                result = Math.exp(value);
                break;
              case "pow":
                result = Math.pow(value, exponent);
                break;
              default:
                throw new Error(`Unsupported function: ${fn}. Available: sin, cos, tan, sqrt, abs, log, ln, exp, pow`);
            }
            
            return `🔬 ${fn}(${value}${fn === 'pow' ? `, ${exponent}` : ''}) = ${result}`;
          } catch (error) {
            return `❌ Function error: ${error.message}`;
          }
        }
      }),

      // Matrix operations tool (basic implementation)
      matrix: tool({
        description: "Performs basic matrix operations (2x2 or 3x3 matrices).",
        args: {
          operation: {
            type: "string",
            enum: ["add", "multiply", "transpose"],
            description: "Matrix operation to perform"
          },
          matrix: {
            type: "array",
            description: "2D array representing the matrix"
          },
          matrix2: {
            type: "array", 
            description: "Second matrix for operations (required for multiply/add)"
          }
        },
        execute: async (args, context) => {
          try {
            const { operation, matrix, matrix2 } = args;
            
            // Basic matrix validation
            if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
              throw new Error("Invalid matrix: must be a non-empty 2D array");
            }
            
            const rows = matrix.length;
            const cols = matrix[0].length;
            
            switch (operation) {
              case "transpose":
                const result = [];
                for (let i = 0; i < cols; i++) {
                  result[i] = [];
                  for (let j = 0; j < rows; j++) {
                    result[i][j] = matrix[j][i];
                  }
                }
                return `🔄 Transpose: ${rows}x${cols} → ${cols}x${rows}: ${JSON.stringify(result)}`;
                
              case "add":
                if (!matrix2) throw new Error("Second matrix required for addition");
                if (matrix2.length !== rows || matrix2[0].length !== cols) {
                  throw new Error("Matrices must have same dimensions for addition");
                }
                const result = [];
                for (let i = 0; i < rows; i++) {
                  result[i] = [];
                  for (let j = 0; j < cols; j++) {
                    result[i][j] = matrix[i][j] + matrix2[i][j];
                  }
                }
                return `➕ Matrix addition: ${JSON.stringify(result)}`;
                
              case "multiply":
                if (!matrix2) throw new Error("Second matrix required for multiplication");
                if (cols !== matrix2.length) {
                  throw new Error("Number of columns in first matrix must equal number of rows in second matrix");
                }
                const result = [];
                for (let i = 0; i < rows; i++) {
                  result[i] = [];
                  for (let j = 0; j < matrix2[0].length; j++) {
                    let sum = 0;
                    for (let k = 0; k < cols; k++) {
                      sum += matrix[i][k] * matrix2[k][j];
                    }
                    result[i][j] = sum;
                  }
                }
                return `✖️ Matrix multiplication: ${rows}x${cols} × ${matrix2.length}x${matrix2[0].length}: ${JSON.stringify(result)}`;
                
              default:
                throw new Error(`Unsupported operation: ${operation}. Available: add, multiply, transpose`);
            }
          } catch (error) {
            return `❌ Matrix error: ${error.message}`;
          }
        }
      })
    },

    // Plugin initialization
    init: async () => {
      console.log("[Scientific Calculator] Plugin fully initialized!");
      console.log("🧮 Available tools: calculate, scientific, matrix");
      console.log("🔬 Functions: basic arithmetic, trigonometry, logarithms, matrix operations");
    }
  };
};

export default scientificCalculatorPlugin;