/* eslint-disable react/no-array-index-key */
import { ThemedText } from "@/components";
import Color from "@/constants/Color";
import { scale } from "@/utils/scaleSize";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Image,
    ImageSourcePropType,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

type DropDownItem = {
    id?: string | number;
    name: string;
    value: any;
};

type DropDownProps = {
    // Action
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

    // Value Text
    label?: string;
    valueColor?: string;
    value?: string;

    // Placeholder
    placeholderTextColor?: string;
    placeholderText?: string;

    // Icon
    iconSize?: number;

    // Left Icon
    leftIcon?: ImageSourcePropType;

    // Searchable
    searchable?: boolean;
    autoFocus?: boolean;
    editable?: boolean;
    secureTextEntry?: boolean;
    blurOnSubmit?: boolean;
    keyboardType?:
        | "default"
        | "number-pad"
        | "decimal-pad"
        | "numeric"
        | "email-address"
        | "phone-pad";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    multiline?: boolean;
    numberOfLines?: number;
    testID?: string;
    listTestID?: string;
    widthdropdown?: string;
    typeValueText?: "Regular" | "Medium";
    isOpen?: (isOpen: boolean, item?: DropDownItem) => void;
};

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

    // Value Text
    label,
    valueColor = Color.Red[500], // fallback to your color system
    value,

    // Placeholder
    placeholderTextColor = Color.Gray[300],
    placeholderText = "Select Drop Down",

    // Icon
    iconSize = 25,

    // Left Icon
    leftIcon,

    // Searchable
    searchable,
    autoFocus,
    editable,
    secureTextEntry,
    blurOnSubmit,
    keyboardType = "default",
    autoCapitalize = "none",
    multiline = false,
    numberOfLines,
    testID,
    listTestID,
    typeValueText = "Regular",
    isOpen = () => null,
}: DropDownProps) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [focus, setFocus] = useState(false);

    let data = items;
    if (keyword) {
        data = data.filter(
            (x) => x?.name?.toLowerCase().search(keyword.toLowerCase()) !== -1
        );
    }

    const getValue = () => {
        if (value) {
            const string = items.filter((v) => {
                return v.value === value;
            });

            return string[0]?.name;
        } else {
            return placeholderText;
        }
    };

    return (
        <View style={style}>
            {label && (
                <ThemedText
                    type="Regular"
                    size="md"
                    color={Color.Gray[600]}
                    style={styles.spacing}
                >
                    {label}
                </ThemedText>
            )}
            <TouchableOpacity
                disabled={disabled}
                onPress={() => {
                    onPressDropDown();
                    setShowDropdown(!showDropdown);
                    isOpen(!showDropdown, undefined);
                }}
                style={[
                    styles.container,
                    containerStyle,
                    {
                        backgroundColor: disabled ? Color.Gray[200] : "#fff",
                        borderColor: Color.Gray[400],
                    },
                    showDropdown && {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                    },
                ]}
                testID={testID}
            >
                <View style={{ flexDirection: "row" }}>
                    {leftIcon ? (
                        <Image
                            source={leftIcon}
                            style={{
                                width: iconSize,
                                height: iconSize,
                            }}
                        />
                    ) : null}
                    <ThemedText
                        type={typeValueText}
                        size="md"
                        color={value ? Color.Base.Black : Color.Gray[300]}
                        style={styles.spacing}
                        numberOfLines={1}
                    >
                        {getValue()}
                    </ThemedText>
                </View>
                <Feather name={dropUp ? "chevron-up" : "chevron-down"} />
            </TouchableOpacity>

            {/* {searchable && showDropdown ? (
                <View
                    style={[
                        styles.dropDownContainer,
                        { height: minHeight, maxHeight: maxHeight },
                    ]}
                >
                    <TextInput
                        editable={editable}
                        autoFocus={autoFocus}
                        secureTextEntry={secureTextEntry}
                        onFocus={() => setFocus(true)}
                        placeholder={placeholderText}
                        placeholderTextColor={placeholderTextColor}
                        keyboardType={keyboardType}
                        autoCapitalize={autoCapitalize}
                        value={keyword}
                        onSubmitEditing={() => {
                            if (data[0]) {
                                onSelectItem(data[0]);
                                setKeyword(data[0].name);
                            }
                            setFocus(false);
                        }}
                        multiline={multiline}
                        numberOfLines={numberOfLines}
                        blurOnSubmit={blurOnSubmit}
                        onChangeText={setKeyword}
                        style={[
                            styles.contentSearch,
                            {
                                color: valueColor || "#000000",
                            },
                        ]}
                    />
                    <ScrollView nestedScrollEnabled>
                        {data.map((item, index) => (
                            <TouchableOpacity
                                onPress={() => {
                                    onSelectItem(item, index);
                                    setShowDropdown(false);
                                    setKeyword("");
                                    isOpen(false, item);
                                }}
                                style={[
                                    index === 0 && { marginTop: 10 },
                                    value === item.name
                                        ? {
                                              backgroundColor:
                                                  "rgba(2, 159, 253, 0.1)",
                                          }
                                        : {},
                                    styles.dropDownItem,
                                ]}
                                key={index}
                                testID={listTestID}
                            >
                                <ThemedText
                                    type="Regular"
                                    size="md"
                                    color="#000"
                                    style={styles.spacing}
                                >
                                    {item.name}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            ) : showDropdown ? (
                <View
                    style={[
                        styles.dropDownContainer,
                        { minHeight: minHeight, maxHeight: maxHeight },
                        dropUp && styles.dropUpAbsolute,
                    ]}
                >
                    <ScrollView
                        contentContainerStyle={{ zIndex: 3, paddingBottom: 8 }}
                        nestedScrollEnabled
                    >
                        {data.map((item, index) => (
                            <TouchableOpacity
                                onPress={() => {
                                    onSelectItem(item, index);
                                    setShowDropdown(false);
                                    setKeyword("");
                                    isOpen(false, item);
                                }}
                                style={[styles.dropDownItem]}
                                key={index}
                            >
                                <ThemedText
                                    type={
                                        value === item.name ? "Bold" : "Regular"
                                    }
                                    size="md"
                                    color="#994D52"
                                    style={styles.spacing}
                                >
                                    {item.name}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            ) : null} */}
            {showDropdown && (
                <View
                    style={[
                        styles.dropDownContainer,
                        {
                            minHeight: minHeight,
                            maxHeight: maxHeight,
                            width: widthdropdown,
                        },
                        dropUp && styles.dropUpAbsolute,
                    ]}
                >
                    <ScrollView
                        contentContainerStyle={{ zIndex: 3, paddingBottom: 8 }}
                        nestedScrollEnabled
                    >
                        {data.map((item, index) => (
                            <TouchableOpacity
                                onPress={() => {
                                    onSelectItem(item, index);
                                    setShowDropdown(false);
                                    setKeyword("");
                                    isOpen(false, item);
                                }}
                                style={[styles.dropDownItem]}
                                key={index}
                            >
                                <ThemedText
                                    type={
                                        value === item.name ? "Bold" : "Regular"
                                    }
                                    size="md"
                                    color="#000"
                                    style={styles.spacing}
                                >
                                    {item.name}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    spacing: {
        marginLeft: scale(4),
    },
    dropDownContainer: {
        backgroundColor: "#fff",
        width: "100%",
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        marginTop: -2,
        zIndex: 999,
        borderWidth: 1,
        borderColor: Color.Gray[400],
        borderTopWidth: 0,
    },
    dropDownItem: {
        paddingLeft: 15,
        paddingVertical: 8,
    },
    dropUpAbsolute: {
        position: "absolute",
        bottom: 50,
        elevation: 10,
        zIndex: 2,
    },
    contentSearch: {
        backgroundColor: "#FFF",
        margin: 16,
        marginBottom: 2,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#EEEE",
    },
    container: {
        marginTop: 8,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});

export default CustomDropDown;
