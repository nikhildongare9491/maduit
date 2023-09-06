import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {SelectList} from 'react-native-dropdown-select-list';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export default function DropDownComponents({
  title,
  data,
  handleSelect,
  onSelectChange,
  initialId,
  initialValue,
}) {
  const [select, setSelect] = useState(initialId);

  // useEffect(() => {
  //   setSelect(initialId);
  // }, [initialId]);

  // console.log('selected', initialId);
  // console.log(data);

  return (
    <View style={styles.dropDownSection}>
      <View style={styles.dropDownTitleBox}>
        <Text style={styles.ticketTitle}>{title}</Text>
      </View>
      <SelectList
        search={false}
        placeholder={initialValue}
        defaultOption={select}
        data={data}
        renderItem={({item}) => (
          <Text style={styles.renderText}>{item.value}</Text>
        )}
        maxHeight={100}
        onSelect={val => {
          // setSelect(val);
          // if (val) {
          if (val !== null && val !== undefined) {
            handleSelect(val);
          } else {
            handleSelect(select);
          }
          // onSelectChange(val);
          // } else {
          //   handleSelect(initialId);
          //   onSelectChange(initialId);
          // }
          // handleSelect(val !== null ? val : initialId);
          // onSelectChange(val !== null ? val : initialId);
          // if (select) {
          //   handleSelect(select);
          // } else {
          //   handleSelect(initialId);
          // }
        }}
        setSelected={val => {
          if (val !== null && val !== undefined) {
            setSelect(val);
            onSelectChange(val);
          } else {
            setSelect(initialId);
            onSelectChange(initialId);
          }
          // if (val) {
          //   setSelect(val);
          //   onSelectChange(val);
          // } else {
          //   setSelect(initialId);
          //   onSelectChange(initialId);
          // }
        }}
        // singleLineTextStyle={{flexWrap: 'nowrap'}}
        value={select}
        boxStyles={styles.boxStyle1}
        dropdownStyles={styles.dropdownStyle}
        inputStyles={styles.inputStyle}
        dropdownTextStyles={styles.dropdownTextStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropDownTitleBox: {
    width: responsiveWidth(70),
    height: responsiveHeight(6),
    backgroundColor: 'rgba(220, 220, 220, 0.5)',
    justifyContent: 'center',
    borderRadius: 10,
  },
  ticketTitle: {
    fontSize: 18,
    fontFamily: 'Raleway-Medium',
    color: 'rgba(0,0,0, 0.6)',
    marginLeft: 7,
  },
  renderText: {color: '#000'},
  dropDownSection: {
    marginTop: 35,
    // marginRight: 10,
    // justifyContent: 'center',
  },
  dropdownStyle: {
    borderColor: 'rgba(220, 220, 220, 1)',
    borderWidth: 1,
  },
  boxStyle1: {
    backgroundColor: '#7CC57F',
    borderColor: '#7CC57F',
    borderWidth: 1,
    marginTop: 10,
    width: responsiveWidth(70),
  },

  inputStyle: {fontSize: 15, color: '#FFFFFF'},
  dropdownTextStyle: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Raleway-Medium',
  },
});
