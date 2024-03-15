import { SchemaModel } from "schema-typed"

export const useSchemaModelValidator = (schema) => {
  schema = SchemaModel(schema)
  const isValid = (data) => Object.values(schema.check(data)).filter(x => x.hasError).length === 0

  return {...schema, isValid: (data) => isValid(data)}
}