import store from 'store'

const USER_KEY = 'user_key'

let storageUtils = {
    // Store current user
    saveUser(user){
        store.set(USER_KEY, user)
    },

    // Get current user
    getUser(){
        return store.get(USER_KEY) || {}
    },

    // Remove current user
    deleteUser(){
        store.remove(USER_KEY)
    }
}
export default storageUtils