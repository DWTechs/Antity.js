import { Operations } from "./operations";
import { Method, Operation } from "./types";

function method(method: Method): Operation | undefined {
  switch (method) {
    case "GET": 
      return Operations[0];
    case "PATCH":
      return Operations[2];
    case "PUT":
      return Operations[2];
    case "POST":
      return Operations[1];
    case "DELETE":
      return Operations[4];
    default:
      return undefined;
  }
}

export default { method };
  