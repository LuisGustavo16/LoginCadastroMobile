import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from "react-native"
import { Painel } from './style';
import { useState, useEffect } from "react";
import React from "react";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

/*Guardar Localização*/
import { IMessage } from "../../services/data/Message";

//Bibliotecas do Mapa
import * as Location from "expo-location"
import MapView, { Region, Marker } from "react-native-maps"

export function Mapa() {
    const [location, setLocation] = useState<null | Location.LocationObject>(null)
    const [region, setRegion] = useState<Region>();
    const [marker, setMarker] = useState<Region[]>();
    const [errorMsg, setErrorMsg] = useState<null | string>(null);

    useEffect(() => {
        const handleLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync();
            if (location) {
                setLocation(location);
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.004,
                    longitudeDelta: 0.004,
                });
                setMarker([
                    {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.004,
                        longitudeDelta: 0.004,
                    },
                ]);
            }
        };
        handleLocation();
    }, []);


    let text = "Waiting...";
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={Painel.container}>
            {!region && <Text style={Painel.texto}>{text}</Text>}
            {region && (
                <MapView style={Painel.map} region={region} showsUserLocation={true}>
                    {marker &&
                        marker.map((item) => (
                            <Marker key={item.latitude} coordinate={item} />
                        ))}

                </MapView>
            )}
        </View>
    );

}