export function propertyValueNestedObject(object, property) {
    return property.split('.').reduce((obj, key) => obj?.[key], object)
  }

export function objectWithMaxValue(array, property) {
    return  array.reduce((prev, current) => {
        if (isNaN(propertyValueNestedObject(current, property) )) {
            return prev;
        }
        return propertyValueNestedObject(prev, property) > propertyValueNestedObject(current, property) ? prev : current
    })
  }

export function objectWithMinValue(array, property) {
    return array.reduce((prev, current) => {
        if (isNaN(propertyValueNestedObject(current, property) )) {
            return prev;
        }
        return propertyValueNestedObject(prev, property) < propertyValueNestedObject(current, property) ? prev : current
    })
  }

export function objectMaxValue(array, property) {
    return propertyValueNestedObject(objectWithMaxValue(array, property), property);
  }

  export function objectMinValue(array, property) {
    return propertyValueNestedObject(objectWithMinValue(array, property),property);
  }

