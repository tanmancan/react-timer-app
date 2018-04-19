export const ADD_TAG = 'ADD_TAG';
export const UPDATE_TAG = 'UPDATE_TAG';
export const DELETE_TAG = 'DELETE_TAG';
export const ADD_CATEGORY = 'ADD_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';

export function addTag({tagState, id}) {
  return {type: ADD_TAG, tagState, id}
}

export function updateTag({ tagState, id }) {
  return { type: UPDATE_TAG, tagState, id }
}

export function deleteTag(id) {
  return {type: DELETE_TAG, id}
}

export function addCategory({categoryName, id}) {
  return {type: ADD_CATEGORY, categoryName, id}
}

export function deleteCategory({categoryName, id}) {
  return {type: DELETE_CATEGORY, categoryName, id}
}