import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";
import {
  IconButton,
  MD3Colors,
  Provider as PaperProvider,
} from "react-native-paper";
import { Button } from "react-native-paper";
import { TextInput } from "react-native-paper";
import { ProductList } from "./components/product-list";
import { DataTable } from "react-native-paper";
import { getCarritoLocal, limpiarCarritoLocal } from "./utils/carrito.helper";
import { crearVenta } from "./utils/crear-venta";
import { crearVentaItem } from "./utils/crear-venta-item";

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TextInput placeholder="Escriba aquí" />
        <View style={{ flex: 1 }}>
          <ProductList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationsScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [carrito, setCarrito] = useState([] as any[]);
  const [venta, setVenta] = useState<any>();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const total = carrito?.reduce(
    (accum, item) => accum + parseFloat(item.price),
    0
  );

  const crearNuevaVenta = async () => {
    setButtonDisabled(true);
    const nuevaVenta = {
      clienteId: 1,
      totalPrice: total.toString(),
      status: "confirmada",
    };

    const result = await crearVenta(nuevaVenta);

    if (result?.id) {
      setVenta(result);
    }
  };

  const agregarVentaItems = async () => {
    for (let producto of carrito) {
      await crearVentaItem({
        productoId: producto?.id,
        ventaId: venta?.id,
      });
    }
    limpiarCarritoLocal();
    navigation.navigate("VentaConfirmada");
  };

  useEffect(() => {
    if (venta?.id) {
      void agregarVentaItems();
    }
  }, [venta]);

  const renderRows = carrito?.map((product, index) => {
    return (
      <DataTable.Row key={index}>
        <DataTable.Cell textStyle={{ color: "#000" }}>
          {product?.name}
        </DataTable.Cell>
        <DataTable.Cell textStyle={{ color: "#000" }}>
          {product?.description}
        </DataTable.Cell>
        <DataTable.Cell textStyle={{ color: "#000" }} numeric>
          ${product?.price}
        </DataTable.Cell>
      </DataTable.Row>
    );
  });

  useEffect(() => {
    const carritoActual = getCarritoLocal() ?? [];

    setCarrito(carritoActual);
  }, []);

  useEffect(() => {
    const carritoActual = getCarritoLocal() ?? [];

    if (carritoActual !== carrito) {
      setCarrito(carritoActual);
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title textStyle={{ color: "#000" }}>
              Nombre
            </DataTable.Title>
            <DataTable.Title textStyle={{ color: "#000" }}>
              Descripcion
            </DataTable.Title>
            <DataTable.Title textStyle={{ color: "#000" }} numeric>
              Precio
            </DataTable.Title>
          </DataTable.Header>
          {renderRows}
          <DataTable.Row>
            <DataTable.Cell textStyle={{ color: "#000", fontWeight: "bold" }}>
              Total
            </DataTable.Cell>
            <DataTable.Cell textStyle={{ color: "#000" }}> </DataTable.Cell>
            <DataTable.Cell
              textStyle={{ color: "#000", fontWeight: "bold" }}
              numeric
            >
              ${total}
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
        <Button
          icon="check"
          mode="contained"
          style={{ marginTop: 10 }}
          disabled={buttonDisabled}
          onPress={() => {
            crearNuevaVenta();
          }}
        >
          Confirmar compra
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const VentaConfirmada = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text style={{ textAlign: "center" }}>Venta confirmada</Text>
      <Text style={{ textAlign: "center", marginTop: 10 }}>
        Te enviamos un email con los datos para que puedas seguir el envio
      </Text>
      <IconButton icon="check-circle-outline" iconColor="#42ba96" size={100} />
    </View>
  );
};

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Belleza" component={HomeScreen} />
          <Drawer.Screen name="Carrito" component={NotificationsScreen} />
          <Drawer.Screen
            options={{
              drawerItemStyle: { display: "none" },
            }}
            name="VentaConfirmada"
            component={VentaConfirmada}
          />
        </Drawer.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    width: "100%",
    padding: 10,
    backgroundColor: "white",
    marginHorizontal: 20,
  },
});
