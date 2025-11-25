import React, { useMemo } from "react";
import { Image, ImageStyle, StyleSheet, View, ViewStyle } from "react-native";

type Coordinate = {
    lat: number;
    lng: number;
};

type UserCoordinate = {
    latitude: number;
    longitude: number;
};

type OfficeStaticMapProps = {
    officeCoordinate: Coordinate;
    userCoordinate?: UserCoordinate | null;
    radius?: number; // dalam meter (visual only)
    userInsideRadius?: boolean; // hasil dari perhitungan jarak kamu
};

const Color = {
    Purple: { 600: "#8B5CF6" },
    Blue: "#2563EB",
    Red: "#EF4444",
    Green: "#22C55E",
};

// fungsi sederhana untuk menghitung offset marker user secara visual
function getOffset(
    user: UserCoordinate,
    office: Coordinate,
    zoom = 17
): { x: number; y: number } {
    if (!user || !office) return { x: 0, y: 0 };

    // semakin tinggi zoom, semakin kecil offset
    const scale = Math.pow(2, zoom - 14);
    const latDiff = (user.latitude - office.lat) * 10000 * scale;
    const lngDiff = (user.longitude - office.lng) * 10000 * scale;

    // y dibalik karena koordinat layar kebalik
    return { x: lngDiff * 3, y: -latDiff * 3 };
}

export const OfficeStaticMap: React.FC<OfficeStaticMapProps> = ({
    officeCoordinate,
    userCoordinate,
    radius = 100,
    userInsideRadius = false,
}) => {
    const { lat, lng } = officeCoordinate;
    const APIKEY = "d3f185bcbd0d44b0b8c800105c6cd354";

    // Gambar statis dari OpenStreetMap
    const mapUrl = useMemo(
        () =>
            `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${lng},${lat}&zoom=17&marker=lonlat:${lng},${lat};type:awesome;color:%23ff0000;size:medium&apiKey=${APIKEY}`,
        [lat, lng]
    );

    const offset = userCoordinate
        ? getOffset(userCoordinate, officeCoordinate)
        : { x: 0, y: 0 };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: mapUrl }}
                style={styles.mapImage as ImageStyle}
                resizeMode="cover"
            />

            {/* Lingkaran radius kantor */}
            <View
                style={[
                    styles.radiusOverlay,
                    {
                        borderColor: Color.Purple[600],
                        backgroundColor: Color.Purple[600] + "1A",
                    },
                ]}
            />

            {/* Marker kantor (tengah) */}
            <View style={[styles.marker, styles.officeMarker]} />

            {/* Marker user (posisi relatif) */}
            {userCoordinate && (
                <View
                    style={[
                        styles.marker,
                        {
                            backgroundColor: userInsideRadius
                                ? Color.Green // ✅ dalam radius
                                : Color.Blue, // ❌ di luar radius
                            transform: [
                                { translateX: offset.x },
                                { translateY: offset.y },
                            ],
                        },
                    ]}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        aspectRatio: 1.5,
        alignItems: "center",
        justifyContent: "center",
    } as ViewStyle,
    mapImage: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
    } as ImageStyle,
    radiusOverlay: {
        position: "absolute",
        width: 200, // hanya visual
        height: 200,
        borderWidth: 2,
        borderRadius: 100,
    } as ViewStyle,
    marker: {
        position: "absolute",
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: "#fff",
    } as ViewStyle,
    officeMarker: {
        backgroundColor: Color.Red,
    } as ViewStyle,
});
