import React, { useState, useEffect } from 'react';
 import { View, TextInput, Pressable,  Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Linking } from 'react-native';

import axios from 'axios';
import DateConvert from './DateConvert';
export default function App() {
  const [data, setData] = useState([]);
  const [minmag, setMag] = useState('');
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
 //  console.log(currentDate);  // Outputs the current date and time

  
   const year = currentDate.getFullYear();
   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
   const day = String(currentDate.getDate()).padStart(2, '0')  ;
  
  // https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2024-08-23%2000:00:00&endtime=2024-08-23%2023:59:59&minmagnitude=5&orderby=time
 
  const convertEpochToDate = (epoch) => {
    const date = new Date(epoch); // Convert epoch to milliseconds
    return date.toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const fetchData = async () => {
    try {

      //https://earthquake.usgs.gov/earthquakes/map/?extent=-87.82409,-247.5&extent=87.79723,607.5&range=search&timeZone=utc&search=%7B%22name%22:%22Search%20Results%22,%22params%22:%7B%22starttime%22:%222024-08-18%2000:00:00%22,%22endtime%22:%222024-08-25%2023:59:59%22,%22minmagnitude%22:2.5,%22eventtype%22:%22earthquake,
      //accidental%20explosion,acoustic%20noise,acoustic_noise,anthropogenic_event,building%20collapse,chemical%20explosion,chemical_explosion,collapse,debris%20avalanche,eq,experimental%20explosion,explosion,ice%20quake,induced%20or%20triggered%20event,industrial%20explosion,landslide,meteor,meteorite,mine%20collapse,mine_collapse,mining%20explosion,mining_explosion,not%20existing,not%20reported,not_reported,nuclear%20explosion,nuclear_explosion,other,other%20event,other_event,quarry,quarry%20blast,quarry_blast,rock%20burst,Rock%20Slide,rockslide,rock_burst,snow%20avalanche,snow_avalanche,sonic%20boom,sonicboom,sonic_boom,train%20crash,volcanic%20eruption,volcanic%20explosion%22,%22orderby%22:%22time%22%7D%7D    

  //    console.log(minmag);
      // const response = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
      const response = await axios.get('https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime='+year+'-'+month+'-'+day+'%2000:00:00&endtime='+
        year+'-'+month+'-'+day+'%2023:59:59&minmagnitude=' + minmag  +  '&orderby=time');
        console.log (response.data.features[0].properties.title);
        const processedData = response.data.features.map(item => ({
         id: item.properties.id,
         title: item.properties.title,
         url: item.properties.url,
         mag: item.properties.mag,
        formattedDate: convertEpochToDate(item.properties.time),
        }));


      setData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Earthquake bigger than  {minmag}  today  .</Text>
    </View>
  );
//  useEffect(() => {
  //  fetchData();
//  }, []);

const handlePress = (url) => {
  Linking.openURL(url).catch(err => console.error('An error occurred', err));
};
  return (


    <View style={styles.container}>
     <Text style={styles.text}>Enter Mag number here : </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your selected Mag "
        value={minmag}
        onChangeText={setMag}
      />
     

      <Pressable
        onPress={fetchData} 
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'gray' : 'blue',
            padding: 10,
            borderRadius: 5,
          },
        ]}
      >
        <Text style={{ color: 'white' }}>Submit</Text>
      </Pressable>
    
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (

     
        
        <FlatList 
          data={data}       
          renderItem={({ item }) => (  

         
            <View style={styles.item}>
         <Text key={item.id} style={styles.item}>

       UTC :  {item.formattedDate} - {item.title}   


          </Text>
       <TouchableOpacity onPress={() => handlePress(item.url)}>
<Text style={styles.linkText}>{item.url}</Text>
</TouchableOpacity>    
            </View>
            
          )}

          ListEmptyComponent={renderEmptyComponent} // Display this component if data is empty
          keyExtractor={(item, index) => index.toString()}
        />

        
      )}
     
    </View>   
  );
 
  
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#F5FCFF',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
