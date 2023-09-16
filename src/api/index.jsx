import ajax from './ajax'
export const reqLogin = (username, password) => ajax('/users/login', { username, password }, "POST")
export const reqAddUser = (user) => ajax('/manage/user/add', user, "POST")
// Gets a list of first - and second-level categories
export const reqCategorys = (parentId) => ajax('/manage/category/list', { parentId })
// Add category
export const reqAddCategory = (categoryName, parentId) => ajax('/manage/category/add', { categoryName, parentId }, "POST")
// Update category
export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', { categoryId, categoryName }, "POST")
// Delete category
export const reqDeleteCategory = (categoryId) => ajax('/manage/category/delete', { categoryId }, "POST")
// Request item list
export const reqItems = (pageNumber, pageSize) => ajax('/manage/item/list', { pageNumber, pageSize })
// Search item list by page
export const reqSearchItems = ({ searchName, searchType }) => ajax('/manage/item/search', {
    [searchType]: searchName
    //[]If its value is searchbyname, then it becomes searchbyname:searchName; If its value is searchbydesc, it becomes searchbydesc:searchName
})
//Get the first and second class names
export const reqCategoryName = (categoryId) => ajax('/manage/category/name', { categoryId })
// update item status
export const reqUpdateItemsStatus = (itemId, itemStatus) => ajax('/manage/item/update_status', { itemId, itemStatus }, "POST")
//delete imgs
export const reqDeleteImg = (name) => ajax('/manage/img/delete', { name }, "POST")
//add item or update item
export const reqAddOrUpdateItem = (item) => ajax(`/manage/item/${item._id ? 'update' : 'add'}`, { item }, "POST");
// get role category list
export const reqRoles = () => ajax('/manage/role/list')
// add role
export const reqAddRole = (name, rate, time) => ajax('/manage/role/add', { name, rate, time }, "POST")
// update role name
export const reqUpdateRoleName = (roleId, rate, name) => ajax('/manage/role/update', { roleId, rate, name }, "POST")
// delete role
export const reqDeleteRole = (roleId) => ajax('/manage/role/delete', { roleId }, "POST")
// update role auth
export const reqUpdateRoleAuth = (roleId, menus, time) => ajax('/manage/role/update_auth', { roleId, menus, time }, "POST")
// get employee category
export const reqEmployees = () => ajax('/manage/employee/list')
// employee search
export const reqEmployeesSearch = (searchType, searchName) => ajax('/manage/employee/list_search', { [searchType]: searchName })
// add employee
export const reqAddEmployee = (employee) => ajax('/manage/employee/add', { employee }, "POST")
// update employee
export const reqUpdateEmployee = (employeeId, employee) => ajax('/manage/employee/update', { employeeId, employee }, "POST")
// delete employee
export const reqDeleteEmployee = (employeeId) => ajax('/manage/employee/delete', { employeeId }, "POST")
// get order list by page
export const reqOrders = (pageNumber, pageSize) => ajax('/manage/order/list', { pageNumber, pageSize })
// search order list by page
export const reqSearchOrders = ({ searchName, searchType }) => ajax('/manage/order/search', {
    [searchType]: searchName
})
// delete category
export const reqDeleteOrder = (orderId) => ajax('/manage/order/delete', { orderId }, "POST")
// get sale ranks
export const reqOrdersRank = (start, end) => ajax('/manage/order/list_rank', { start, end })
// get StorageCategory list
export const reqStorageCategory = () => ajax('/manage/storage/category_list')
// add StorageCategory
export const reqAddStorageCategory = (storageCategory) => ajax('/manage/storage/category_add', { storageCategory }, "POST")
// update StorageCategory
export const reqUpdateStorageCategory = (storageCategoryId, storageCategory) => ajax('/manage/storage/category_update', { storageCategoryId, storageCategory }, "POST")
// delete StorageCategory
export const reqDeleteStorageCategory = (storageCategoryId) => ajax('/manage/storage/category_delete', { storageCategoryId }, "POST")
export const reqStorageItems = (pageNumber, pageSize) => ajax('/manage/storage/item_list', { pageNumber, pageSize })
// add StorageCategory
export const reqAddOrUpdateStorageItem = (storageItem) => ajax(`/manage/storage/${storageItem._id ? 'item_update' : 'item_add'}`, { storageItem }, "POST")
// delete StorageCategory
export const reqDeleteStorageItem = (storageItemId) => ajax('/manage/storage/item_delete', { storageItemId }, "POST")
// search item category lisby page
export const reqSearchStorageItems = ({ pageNumber, pageSize, searchName, searchType }) => ajax('/manage/storage/item_search', {
    pageNumber,
    pageSize,
    [searchType]: searchName
})
//update storage
export const reqUpdateStorageItemStorage = (storageItemId, amount) => ajax('/manage/storage/item_storage_update', { storageItemId, amount }, "POST")
export const reqStorageItemsSort = (pageNumber, pageSize, isAsend) => ajax('/manage/storage/item_list_sort', { pageNumber, pageSize, isAsend })
// get record list
export const reqEmployeesRecords = (searchType, searchName, start, end) => ajax('/manage/employee/record_list', { [searchType]: searchName, start, end })// delete StorageCategory
//delete record
export const reqDeleteEmployeesRecord = (recordId) => ajax('/manage/employee/record_delete', { recordId }, "POST")
//add record
export const reqOperationRecordAdd = (operation, username, time, amount, item_id) => ajax('/manage/storage/operation_add', { operation, username, time, amount, item_id }, "POST")
//record list
export const reqOperationRecord = (start, end) => ajax('/manage/storage/operation_record', { start, end })
//record delete
export const reqOperationRecordDelete = (recordId) => ajax('/manage/storage/operation_record_delete', { recordId }, "POST")