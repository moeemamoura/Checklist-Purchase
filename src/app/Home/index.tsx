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

  function handleAdd(){
    if(!description.trim()){
      return Alert.alert("Adicionar", "Informe a descricao para adicionar")
    }
    const newItem = {
      id: Math.random().toString(36).substring(2),
      description,
      status: FilterStatus.PEDING,
    }
  
    setItems((prevState) => [...prevState, newItem])
  }
  useEffect(() => {
    itemsStorage.get().then((response) => console.log(response))
  }, [])
  
  return (
    <View style={styles.container}> 
      <Image source={require("@/assets/logo.png")} style={styles.logo}/>

        <View style={styles.form}>
          <Input placeholder="O que voce quer comprar?"
          onChangeText={setDescription}/>
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

          <TouchableOpacity style={styles.clearButton}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id }
          renderItem={({ item }) => (
            <Item 
              data={item}
              onRemove={() => console.log("rempvehyhgu")}
              onStatus={() => console.log("deu")}
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