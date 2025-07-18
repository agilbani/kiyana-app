import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import {
  ThemedDatePickerProps,
  ThemedDatePickerState,
} from "@/types/components";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcArrowDown, IcDatePicker } from "@assets/icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import "moment/locale/id";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedGap, ThemedText } from "../ui";
import ThemedErrorMessage from "./ThemedErrorMessage";

export default class ThemedDatePicker extends React.PureComponent<
  ThemedDatePickerProps,
  ThemedDatePickerState
> {
  constructor(props: ThemedDatePickerProps) {
    super(props);
    this.state = {
      value: undefined,
      showPicker: false,
    };
  }

  openPicker = () => {
    if (!this.props.disabled) {
      this.setState({ showPicker: true });
    }
  };

  onDateChange = (_: any, selectedDate?: Date) => {
    const currentDate = selectedDate ?? this.state.value;
    this.setState({ showPicker: Platform.OS === "ios", value: currentDate });
  };

  getComputedStyles = () => {
    const { error, disabled } = this.props;

    let borderColor = Color.Gray[400];
    let textColor = Color.Text.Primary;
    let backgroundColor = Color.Background.Background;

    if (disabled) {
      borderColor = Color.Gray[300];
      textColor = Color.Gray[400];
      backgroundColor = Color.Gray[50];
    } else if (error) {
      borderColor = Color.Red[500];
    }

    return {
      borderColor,
      textColor,
      backgroundColor,
    };
  };

  render() {
    const { error, disabled, label } = this.props;
    const { value, showPicker } = this.state;
    const stylesComputed = this.getComputedStyles();

    const formattedDate = value
      ? moment(value).locale("id").format("DD MMMM YYYY")
      : "";

    return (
      <View>
        {label && (
          <>
            <ThemedText
              type="Regular"
              size="sm"
              color={Color.Gray[600]}
              style={styles.spacing}
            >
              {label}
            </ThemedText>
            <ThemedGap height="xxs" />
          </>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.openPicker}
          disabled={disabled}
        >
          <View style={styles.outerContainer}>
            <View
              style={[
                styles.container,
                {
                  borderColor: stylesComputed.borderColor,
                  backgroundColor: stylesComputed.backgroundColor,
                },
                GlobalStyles.rowCenter,
              ]}
            >
              <IcDatePicker />
              <ThemedGap width="xs" />
              <View style={[GlobalStyles.flex]}>
                <ThemedText
                  type="Regular"
                  size="md"
                  color={value ? stylesComputed.textColor : Color.Gray[400]}
                >
                  {formattedDate || "Pilih tanggal"}
                </ThemedText>
              </View>
              <IcArrowDown width={20} height={20} />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.spacing}>
          <ThemedErrorMessage message={error} />
        </View>

        {showPicker && (
          <DateTimePicker
            value={value ?? new Date()}
            mode="date"
            display="default"
            onChange={this.onDateChange}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  spacing: {
    marginLeft: scale(4),
  },
  outerContainer: {
    borderWidth: 3,
    borderColor: "transparent",
    borderRadius: scale(Radius.sm),
  },
  container: {
    height: verticalScale(44),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    borderWidth: 1.5,
    borderRadius: scale(Radius.xs),
  },
});
