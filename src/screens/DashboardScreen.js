import React, { useState } from 'react';
import {
View,
Text,
TextInput,
StyleSheet,
ScrollView,
TouchableOpacity,
Alert,
} from 'react-native';

import { menuItems } from '../data/menu';
import { useOrders } from '../context/OrderContext';
import { useTheme } from '../context/ThemeContext';

export default function DashboardScreen({ navigation }) {
const { isDarkMode } = useTheme();

const colors = {
background: isDarkMode ? '#121212' : '#F7F7F7',
card: isDarkMode ? '#242424' : '#FFFFFF',
text: isDarkMode ? '#FFFFFF' : '#222222',
secondary: isDarkMode ? '#BBBBBB' : '#666666',
input: isDarkMode ? '#333333' : '#FAFAFA',
border: isDarkMode ? '#555555' : '#DDDDDD',
category: isDarkMode ? '#383838' : '#EEEEEE',
};

const [items, setItems] = useState(menuItems);
const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [price, setPrice] = useState('');
const [category, setCategory] = useState('Mains');
const [editingId, setEditingId] = useState(null);

const { orders } = useOrders();

const availableCount = items.filter(
(item) => item.isAvailable
).length;

const resetForm = () => {
setName('');
setDescription('');
setPrice('');
setCategory('Mains');
setEditingId(null);
};

const saveItem = () => {
if (!name.trim() || !description.trim() || !price.trim()) {
Alert.alert('Missing Information', 'Please fill in all fields.');
return;
}

const numericPrice = Number(price);

if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
  Alert.alert('Invalid Price', 'Enter a valid price greater than zero.');
  return;
}

if (editingId !== null) {
  setItems((previous) =>
    previous.map((item) =>
      item.id === editingId
        ? {
            ...item,
            name: name.trim(),
            description: description.trim(),
            price: numericPrice,
            category,
          }
        : item
    )
  );

  Alert.alert('Success', 'Menu item updated.');
} else {
  const newItem = {
    id: Date.now().toString(),
    name: name.trim(),
    description: description.trim(),
    price: numericPrice,
    category,
    isSpecial: false,
    isAvailable: true,
  };

  setItems((previous) => [...previous, newItem]);
  Alert.alert('Success', 'New menu item added.');
}

resetForm();

};

const editItem = (item) => {
setEditingId(item.id);
setName(item.name);
setDescription(item.description);
setPrice(String(item.price));
setCategory(item.category);
};

const deleteItem = (id) => {
Alert.alert(
'Delete Item',
'Are you sure you want to delete this item?',
[
{ text: 'Cancel', style: 'cancel' },
{
text: 'Delete',
style: 'destructive',
onPress: () => {
setItems((previous) =>
previous.filter((item) => item.id !== id)
);

        if (editingId === id) {
          resetForm();
        }
      },
    },
  ]
);

};

const toggleAvailability = (id) => {
setItems((previous) =>
previous.map((item) =>
item.id === id
? { ...item, isAvailable: !item.isAvailable }
: item
)
);
};

return (
<ScrollView
style={[styles.container, { backgroundColor: colors.background }]}
contentContainerStyle={styles.content}
>
<Text style={[styles.title, { color: colors.text }]}>
Manager Dashboard
</Text>

  <View style={styles.statsRow}>
    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
      <Text style={styles.statNumber}>{items.length}</Text>
      <Text style={[styles.statLabel, { color: colors.secondary }]}>
        Total Items
      </Text>
    </View>

    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
      <Text style={styles.statNumber}>{availableCount}</Text>
      <Text style={[styles.statLabel, { color: colors.secondary }]}>
        Available
      </Text>
    </View>

    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
      <Text style={styles.statNumber}>{orders.length}</Text>
      <Text style={[styles.statLabel, { color: colors.secondary }]}>
        Orders
      </Text>
    </View>
  </View>

  <TouchableOpacity
    style={styles.ordersButton}
    onPress={() => navigation.navigate('Orders')}
  >
    <Text style={styles.buttonText}>
      Manage Customer Orders ({orders.length})
    </Text>
  </TouchableOpacity>

  <View style={[styles.formCard, { backgroundColor: colors.card }]}>
    <Text style={[styles.sectionTitle, { color: colors.text }]}>
      {editingId !== null ? 'Edit Menu Item' : 'Add New Menu Item'}
    </Text>

    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: colors.input,
          color: colors.text,
          borderColor: colors.border,
        },
      ]}
      placeholder="Food name"
      placeholderTextColor={colors.secondary}
      value={name}
      onChangeText={setName}
    />

    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: colors.input,
          color: colors.text,
          borderColor: colors.border,
        },
      ]}
      placeholder="Food description"
      placeholderTextColor={colors.secondary}
      value={description}
      onChangeText={setDescription}
    />

    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: colors.input,
          color: colors.text,
          borderColor: colors.border,
        },
      ]}
      placeholder="Price (Rs.)"
      placeholderTextColor={colors.secondary}
      value={price}
      onChangeText={setPrice}
      keyboardType="decimal-pad"
    />

    <Text style={[styles.label, { color: colors.text }]}>
      Select Category
    </Text>

    <View style={styles.categoryRow}>
      {['Starters', 'Mains', 'Desserts', 'Drinks'].map((value) => (
        <TouchableOpacity
          key={value}
          style={[
            styles.categoryButton,
            { backgroundColor: colors.category },
            category === value && styles.selectedCategory,
          ]}
          onPress={() => setCategory(value)}
        >
          <Text
            style={[
              styles.categoryText,
              { color: colors.text },
              category === value && styles.selectedCategoryText,
            ]}
          >
            {value}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <TouchableOpacity style={styles.saveButton} onPress={saveItem}>
      <Text style={styles.buttonText}>
        {editingId !== null ? 'Update Item' : 'Add Item'}
      </Text>
    </TouchableOpacity>

    {editingId !== null && (
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={resetForm}
      >
        <Text style={styles.cancelText}>Cancel Editing</Text>
      </TouchableOpacity>
    )}
  </View>

  <Text style={[styles.sectionTitle, { color: colors.text }]}>
    Manage Menu Items
  </Text>

  {items.map((item) => (
    <View
      key={item.id}
      style={[styles.itemCard, { backgroundColor: colors.card }]}
    >
      <Text style={[styles.itemName, { color: colors.text }]}>
        {item.name}
      </Text>

      <Text style={[styles.description, { color: colors.secondary }]}>
        {item.description}
      </Text>

      <Text style={styles.price}>
        Rs. {Number(item.price).toFixed(2)}
      </Text>

      <Text style={[styles.categoryLabel, { color: colors.secondary }]}>
        Category: {item.category}
      </Text>

      <Text
        style={[
          styles.availability,
          item.isAvailable ? styles.available : styles.unavailable,
        ]}
      >
        {item.isAvailable ? 'Available' : 'Unavailable'}
      </Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editItem(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => toggleAvailability(item.id)}
        >
          <Text style={styles.buttonText}>
            {item.isAvailable ? 'Disable' : 'Enable'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteItem(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  ))}
</ScrollView>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
},
content: {
padding: 15,
paddingBottom: 30,
},
title: {
fontSize: 25,
fontWeight: 'bold',
marginBottom: 18,
},
statsRow: {
flexDirection: 'row',
gap: 8,
marginBottom: 15,
},
statCard: {
flex: 1,
paddingVertical: 16,
borderRadius: 10,
alignItems: 'center',
elevation: 2,
},
statNumber: {
fontSize: 23,
fontWeight: 'bold',
color: '#E85D04',
},
statLabel: {
fontSize: 12,
marginTop: 5,
},
ordersButton: {
backgroundColor: '#263238',
padding: 15,
borderRadius: 10,
alignItems: 'center',
marginBottom: 20,
},
buttonText: {
color: '#FFFFFF',
fontWeight: 'bold',
fontSize: 13,
},
formCard: {
padding: 15,
borderRadius: 12,
marginBottom: 22,
elevation: 2,
},
sectionTitle: {
fontSize: 20,
fontWeight: 'bold',
marginBottom: 12,
},
input: {
borderWidth: 1,
padding: 12,
borderRadius: 8,
marginBottom: 10,
fontSize: 15,
},
label: {
fontWeight: '600',
marginBottom: 8,
},
categoryRow: {
flexDirection: 'row',
flexWrap: 'wrap',
gap: 7,
marginBottom: 15,
},
categoryButton: {
paddingVertical: 9,
paddingHorizontal: 10,
borderRadius: 7,
},
selectedCategory: {
backgroundColor: '#E85D04',
},
categoryText: {
fontSize: 12,
},
selectedCategoryText: {
color: '#FFFFFF',
fontWeight: 'bold',
},
saveButton: {
backgroundColor: '#E85D04',
padding: 14,
borderRadius: 8,
alignItems: 'center',
},
cancelButton: {
alignItems: 'center',
padding: 10,
},
cancelText: {
color: '#D00000',
fontWeight: 'bold',
},
itemCard: {
padding: 15,
borderRadius: 12,
marginBottom: 12,
elevation: 2,
},
itemName: {
fontSize: 18,
fontWeight: 'bold',
},
description: {
marginTop: 5,
},
price: {
fontSize: 16,
fontWeight: 'bold',
color: '#E85D04',
marginTop: 7,
},
categoryLabel: {
marginTop: 5,
},
availability: {
fontWeight: 'bold',
marginTop: 7,
},
available: {
color: '#228B22',
},
unavailable: {
color: '#D00000',
},
actionRow: {
flexDirection: 'row',
flexWrap: 'wrap',
gap: 8,
marginTop: 12,
},
editButton: {
backgroundColor: '#1976D2',
padding: 10,
borderRadius: 7,
},
toggleButton: {
backgroundColor: '#555555',
padding: 10,
borderRadius: 7,
},
deleteButton: {
backgroundColor: '#D00000',
padding: 10,
borderRadius: 7,
},
});