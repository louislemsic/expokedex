import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

interface Pokemon {
  name: string;
  url: string;
  image?: string;
}

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    getPokemons();
  }, []);

  const getPokemons = async () => {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=20",
      );
      const data = await response.json();

      const withDetails = await Promise.all(
        data.results.map(async (pokemon: Pokemon) => {
          const response = await fetch(pokemon.url);
          const data = await response.json();
          return {
            name: pokemon.name,
            image: data.sprites.front_default,
          };
        }),
      );

      setPokemons(withDetails);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView>
      {pokemons.map((pokemon: Pokemon) => (
        <View key={pokemon.name}>
          <Text>{pokemon.name}</Text>
          <Image
            source={{ uri: pokemon.image }}
            style={{ width: 100, height: 100 }}
          />
        </View>
      ))}
    </ScrollView>
  );
}
