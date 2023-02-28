import React from "react";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { BASE_URL } from "../constants/api-constants";
import useFetch from "../hooks/use-fetch";
import { agregarProductoAlCarritoLocalByProductoId } from "../utils/carrito.helper";

export const ProductList = (): React.ReactElement => {
  const [visible, setVisible] = React.useState(false);

  const handleOnClick = (product: any) => {
    agregarProductoAlCarritoLocalByProductoId(product);

    setVisible(!visible);

    setTimeout(() => {
      setVisible(false);
    }, 1500);
  };

  const onDismissSnackBar = () => setVisible(false);

  const url = `${BASE_URL}product`;

  const { data, error } = useFetch<any[]>(url);

  const renderProducts = data?.map((product, index) => {
    return (
      <Card style={{ borderRadius: 22, margin: 12 }} key={index}>
        <Card.Content>
          <Text variant="titleLarge">{product?.category?.name}</Text>
          <Text variant="bodyMedium">{product?.name}</Text>
        </Card.Content>
        <Card.Cover
          source={{
            uri: product?.images,
          }}
          style={{ margin: 20 }}
          resizeMode={"stretch"}
        />

        <Text style={{ margin: 17 }}>{product?.description}</Text>
        <Text style={{ marginLeft: 22 }}>
          Precio $ <Text variant="titleLarge">{product?.price}</Text>
        </Text>
        <Card.Actions>
          <Button
            icon="check"
            mode="contained"
            onPress={() => handleOnClick(product)}
          >
            Comprar
          </Button>
        </Card.Actions>
      </Card>
    );
  });

  const renderLabel = visible ? (
    <Text style={{ color: "#000", textAlign: "center", marginTop: 10 }}>
      Producto agregado al carrito
    </Text>
  ) : undefined;

  if (error) return <Text>There is an error</Text>;
  if (!data) return <Text>Loading...</Text>;
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {renderLabel}
      {renderProducts}
    </View>
  );
};
