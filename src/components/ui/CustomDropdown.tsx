/* eslint-disable react/no-array-index-key */
import { ThemedText } from "@/components";
import Color from "@/constants/Color";
import { scale } from "@/utils/scaleSize";
import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
    Image,
    ImageSourcePropType,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

/* ================= TYPES ================= */

type DropDownItem = {
    id?: string | number;
    name: string;
    value: any;
};

type DropDownProps = {
    items?: DropDownItem[];
    onSelectItem: (item: DropDownItem, index?: number) => void;
    disabled?: boolean;
    onPressDropDown?: () => void;

    // Style
    style?: ViewStyle;
    containerStyle?: ViewStyle;
    minHeight?: number;
    maxHeight?: number;
    dropUp?: boolean;
    widthdropdown?: string;

    // Value Text
    label?: string;
    valueColor?: string;
    value?: any;

    // Placeholder
    placeholderTextColor?: string;
    placeholderText?: string;

    // Icon
    iconSize?: number;

    // Left Icon
    leftIcon?: ImageSourcePropType;

    // Search
    searchable?: boolean;
    debounceDelay?: number;

    // Input
    autoFocus?: boolean;
    editable?: boolean;
    keyboardType?:
        | "default"
        | "number-pad"
        | "decimal-pad"
        | "numeric"
        | "email-address"
        | "phone-pad";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";

    // Text
    labelSize?: "md" | "sm" | "lg";
    typeValueText?: "Regular" | "Medium";

    // Callback
    isOpen?: (isOpen: boolean, item?: DropDownItem) => void;

    testID?: string;
    listTestID?: string;
};

/* ================= COMPONENT ================= */

const CustomDropDown = ({
    items = [],
    onSelectItem,
    disabled,
    onPressDropDown = () => null,

    // Style
    style,
    containerStyle,
    minHeight = 80,
    maxHeight,
    dropUp = false,
    widthdropdown = "100%",

    // Value
    label,
    valueColor = Color.Gray[800],
    value,
    placeholderText = "Select option",
    placeholderTextColor = Color.Gray[300],

    // Icon
    iconSize = 24,
    leftIcon,

    // Search
    searchable = false,
    debounceDelay = 300,

    // Input
    autoFocus = false,
    editable = true,
    keyboardType = "default",
    autoCapitalize = "none",

    // Text
    labelSize = "md",
    typeValueText = "Regular",

    // Callback
    isOpen = () => null,

    testID,
    listTestID,
}: DropDownProps) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");

    /* ================= DEBOUNCE ================= */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, debounceDelay);

        return () => clearTimeout(timer);
    }, [keyword, debounceDelay]);

    /* ================= FILTER ================= */
    const filteredItems = useMemo(() => {
        if (!debouncedKeyword) return items;

        return items.filter((item) =>
            item.name.toLowerCase().includes(debouncedKeyword.toLowerCase())
        );
    }, [items, debouncedKeyword]);

    /* ================= VALUE ================= */
    const getValue = () => {
        if (value !== undefined && value !== null) {
            const selected = items.find((item) => item.value === value);
            return selected?.name ?? placeholderText;
        }
        return placeholderText;
    };

    return (
        <View style={style}>
            {label && (
                <ThemedText
                    type="Regular"
                    size={labelSize}
                    color={Color.Gray[600]}
                    style={{ marginBottom: scale(4) }}
                >
                    {label}
                </ThemedText>
            )}

            {/* HEADER */}
            <TouchableOpacity
                disabled={disabled}
                testID={testID}
                onPress={() => {
                    onPressDropDown();
                    setShowDropdown((prev) => {
                        isOpen(!prev);
                        return !prev;
                    });
                }}
                style={[
                    styles.container,
                    containerStyle,
                    {
                        backgroundColor: disabled ? Color.Gray[200] : "#fff",
                    },
                    showDropdown && {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                    },
                ]}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {leftIcon && (
                        <Image
                            source={leftIcon}
                            style={{
                                width: iconSize,
                                height: iconSize,
                                marginRight: 8,
                            }}
                        />
                    )}
                    <ThemedText
                        type={typeValueText}
                        size="md"
                        color={value ? Color.Gray[900] : placeholderTextColor}
                        numberOfLines={1}
                    >
                        {getValue()}
                    </ThemedText>
                </View>
                <Feather
                    size={20}
                    name={dropUp ? "chevron-up" : "chevron-down"}
                />
            </TouchableOpacity>

            {/* DROPDOWN */}
            {showDropdown && (
                <View
                    style={[
                        styles.dropDownContainer,
                        {
                            minHeight,
                            maxHeight,
                            width: widthdropdown,
                        },
                        dropUp && styles.dropUpAbsolute,
                    ]}
                >
                    {searchable && (
                        <TextInput
                            value={keyword}
                            onChangeText={setKeyword}
                            placeholder="Search..."
                            placeholderTextColor={placeholderTextColor}
                            autoFocus={autoFocus}
                            editable={editable}
                            keyboardType={keyboardType}
                            autoCapitalize={autoCapitalize}
                            style={[
                                styles.contentSearch,
                                { color: valueColor },
                            ]}
                        />
                    )}

                    <ScrollView nestedScrollEnabled>
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id ?? index}
                                    testID={listTestID}
                                    onPress={() => {
                                        onSelectItem(item, index);
                                        setShowDropdown(false);
                                        setKeyword("");
                                        setDebouncedKeyword("");
                                        isOpen(false, item);
                                    }}
                                    style={styles.dropDownItem}
                                >
                                    <ThemedText
                                        type={
                                            value === item.value
                                                ? "Bold"
                                                : "Regular"
                                        }
                                        size="md"
                                        color="#000"
                                    >
                                        {item.name}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <ThemedText
                                size="sm"
                                color={Color.Gray[400]}
                                style={{ padding: 12 }}
                            >
                                No data found
                            </ThemedText>
                        )}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Color.Gray[400],
        paddingHorizontal: 15,
        paddingVertical: 13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dropDownContainer: {
        backgroundColor: "#fff",
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        marginTop: -1,
        zIndex: 999,
        borderWidth: 1,
        borderColor: Color.Gray[400],
        borderTopWidth: 0,
    },
    dropDownItem: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    dropUpAbsolute: {
        position: "absolute",
        bottom: 52,
        elevation: 10,
        zIndex: 2,
    },
    contentSearch: {
        backgroundColor: "#FFF",
        margin: 12,
        marginBottom: 4,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Color.Gray[300],
    },
});

export default CustomDropDown;
