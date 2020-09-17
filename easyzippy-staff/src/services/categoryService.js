
const KEYS = {
    category: 'category', 
    cartegoryId: 'cartegoryId'
}

export function insertCategory(data) {
    let category=getAllCategory();
    data['id'] = generateCategoryId();
    category.push(data);
    localStorage.setItem(KEYS.category, JSON.stringify(category))
}

export function updateCategory(data) {
    let category = getAllCategory();
    let recordIndex = category.findIndex(x => x.id === data.id);
    category[recordIndex] = { ...data }
    localStorage.setItem(KEYS.category, JSON.stringify(category))
}

export function deleteCategory(id) {
    let category = getAllCategory();
    category = category.filter(x => x.id !== id) 
    localStorage.setItem(KEYS.category, JSON.stringify(category));
}

export function generateCategoryId() {
    if(localStorage.getItem(KEYS.cartegoryId) == null) 
        localStorage.setItem(KEYS.cartegoryId, '0')
    var id = parseInt(localStorage.getItem(KEYS.cartegoryId))
    localStorage.setItem(KEYS.cartegoryId, (++id).toString())
    return id; 
}

export function getAllCategory() {
    if (localStorage.getItem(KEYS.category) == null) 
        localStorage.setItem(KEYS.category, JSON.stringify([]))
    let category = JSON.parse(localStorage.getItem(KEYS.category));
    return category;
}