import { useState, useEffect } from "react"
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  Alert,
} from "react-native"

import { Input } from "@/app/components/Input"
import { Button } from "@/app/components/Button"
import { Filter } from "@/app/components/Filter"
import { Item } from "../components/Item"

import { styles } from "./styles"
import { FilterStatus } from "@/types/FilterStatus"
import { ItemStorage, itemsStorage } from "@/storage/itemsStorage"

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PEDING, FilterStatus.DONE]


export function Home(){
  const [filter, setFilter] = useState(FilterStatus.PEDING)
  const [description, setDescription] = useState("")
  const [items, setItems] = useState<ItemStorage[]>([])

  async function handleAdd(){
    if(!description.trim()){
      return Alert.alert("Adicionar", "Informe a descricao para adicionar")
    }
    const newItem = {
      id: Math.random().toString(36).substring(2),
      description,
      status: FilterStatus.PEDING,
    }
  
    await itemsStorage.add(newItem)
    await ItemsByStatus()

    setDescription("")
    setFilter(FilterStatus.PEDING)
  }

  async function ItemsByStatus() {
    try {
      const response = await itemsStorage.getByStatus(filter)
      setItems(response)
    } catch (error){
      Alert.alert("Erro", "Nao foi possivel filtrar os itens.")
    }
  }

  async function handleRemove(id:string) {
    try {
      await itemsStorage.remove(id)
      await ItemsByStatus()
    } catch (error) {
      console.log(error)
      Alert.alert("Remover", "nao foi possivel remover.")
    }
  }

  function handleClear() {
    Alert.alert("Limpar", "Deseja remover todos?", [
      { text: "Nao", style:"cancel"},
      { text: "Sim", onPress: () => OnClear()}
    ])
  }

  async function OnClear() {
    try {
      await itemsStorage.clear()
      setItems([])

    } catch (error) {
      console.log(error)
      Alert.alert("Erro", "nao foi possivel remover todos os itens.")
    }
  }

  async function HandleToggleItemsStatus(id: string) {
    try {
      await itemsStorage.toggleStatus(id)
      await ItemsByStatus()

    } catch (error) {
      console.log(error)
      Alert.alert("Erro", "Nao foi possivel atualizar o status.")
    }
  }

  useEffect(() => {
    ItemsByStatus()
  }, [filter])

  return (
    <View style={styles.container}> 
      <Image source={require("@/assets/logo.png")} style={styles.logo}/>

        <View style={styles.form}>
          <Input 
            placeholder="O que voce quer comprar?"
            onChangeText={setDescription}
            value={description}
          />
          <Button title="Adicionar" onPress={handleAdd}/>
        </View>

      <View style={styles.content}>
        <View style={styles.header}> // botao icone comprado/pendente
          {FILTER_STATUS.map((status) => 
            <Filter 
              key={status} 
              status={status} 
              isActive = { status === filter}
              onPress={() => setFilter(status)}
            />
          )}

          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id }
          renderItem={({ item }) => (
            <Item 
              data={item}
              onRemove={() => handleRemove(item.id)}
              onStatus={() => HandleToggleItemsStatus(item.id)}
              />
          )}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={()=> <View style={styles.separator}/>}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>Nenhum Item aqui.</Text>
          )}
        />
      </View>
    </View>
  )
}