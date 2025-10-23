 import AsyncStorage from "@react-native-async-storage/async-storage";           
import { FilterStatus } from "@/types/FilterStatus"

const ITEMS_STORAGE_KEY = "@comprar:items"

export type ItemStorage = {
    id: string
    status: FilterStatus
    description: string
}

async function get(): Promise<ItemStorage[]>{
    try {
        const storage = await AsyncStorage.getItem(ITEMS_STORAGE_KEY)
    
        return storage ? JSON.parse(storage) : []
    } catch (error) {
        throw new Error("GET_ITEMS: " + error)

    }
}

async function getByStatus(status: FilterStatus): Promise<ItemStorage[]> {
    const items = await get()
    return items.filter((items) => items.status === status)
}

async function save(items : ItemStorage[]): Promise<void> {
    try {        
        await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
        throw new Error("SAVE ITEMS: " + error)
    }
}

async function add(newItem: ItemStorage): Promise<ItemStorage[]> {
    const items = await get()
    const update = [...items, newItem]
    await save(update)

    return update
}

async function remove(id: string): Promise<void> {
    const items = await get()
    const updateItems = items.filter((item) => item.id !== id)
    await save(updateItems)
}

async function clear(): Promise<void>{
    try {
        await AsyncStorage.removeItem(ITEMS_STORAGE_KEY)
    } catch (error) {
        throw new Error("CLEAN_ERRO : " + error)
    }
}

async function toggleStatus(id: string): Promise<void> {
    const items = await get()

    const updateItems = items.map((item) =>
        item.id === id
        ? {
            ...item,
            status: 
                item.status === FilterStatus.PEDING
                    ? FilterStatus.DONE
                    : FilterStatus.PEDING
         }
        : item
    )
    
    await save(updateItems)
}
export const itemsStorage = {
    get,
    getByStatus,
    add,
    remove,
    clear,
    toggleStatus,
}