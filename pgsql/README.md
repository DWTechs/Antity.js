| Name        | alias | types                   | Description |
| :---------- | :---- | :---------------------- | :-------------------------------------------------------- |
| startsWith  |       | string                  | Whether the value starts with the filter value |
| contains	  |       | string                  | Whether the value contains the filter value |
| endsWith    |       | string                  | Whether the value ends with the filter value |
| notContains |       | string                  | Whether the value does not contain filter value |
| equals	    |       | string \| number        | Whether the value equals the filter value |
| notEquals	  |       | string \| number        | Whether the value does not equal the filter value |
| in	        |       | string[] \| number[]    | Whether the value contains the filter value |
| lt	        |       | string \| number        | Whether the value is less than the filter value |
| lte	        |       | string \| number        | Whether the value is less than or equals to the filter value |
| gt	        |       | string \| number        | Whether the value is greater than the filter value |
| gte	        |       | string \| number        | Whether the value is greater than or equals to the filter value |
| is	        |       | date \| boolean \| null | Whether the value equals the filter value, alias to equals |
| isNot	      |       | date \| boolean \| null | Whether the value does not equal the filter value, alias to notEquals |
| before      |       | date                    | Whether the date value is before the filter date |
| after	      |       | date                    | Whether the date value is after the filter date |
| between     |       | date[2] \| number[2]    | Whether the value is between the filter values | 