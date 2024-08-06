// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import Constants from "expo-constants";
// import { captureRef } from "react-native-view-shot";
// import { StatusBar } from "expo-status-bar";
// import { Text, Button, StyleSheet, View, Platform } from "react-native";
// import domtoimage from "dom-to-image";
// import ImageViewer from "./components/ImageViewer";
// import Button from "./components/Button";
// import * as ImagePicker from "expo-image-picker";
// import { useState, useRef, useEffect } from "react";
// import IconButton from "./components/IconButton";
// import CircleButton from "./components/CircleButton";
// import EmojiPicker from "./components/EmojiPicker";
// import EmojiList from "./components/EmojiList";
// import EmojiSticker from "./components/EmojiSticker";
// import * as MediaLibrary from "expo-media-library";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// const PlaceholderImage = require("./assets/images/background-image.png");

// export default function App() {
//   const imageRef = useRef();
//   const [status, requestPermission] = MediaLibrary.usePermissions();
//   const [pickedEmoji, setPickedEmoji] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [showAppOptions, setShowAppOptions] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);

//   if (status === null) {
//     requestPermission();
//   }

//   const pickImageAsync = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setSelectedImage(result.assets[0].uri);
//       setShowAppOptions(true);
//     } else {
//       alert("You did not select any image.");
//     }
//   };

//   const onReset = () => {
//     setPickedEmoji(null);
//     setShowAppOptions(false);
//   };

//   const onAddSticker = () => {
//     setIsModalVisible(true);
//   };

//   const onModalClose = () => {
//     setIsModalVisible(false);
//   };

//   const onSaveImageAsync = async () => {
//     if (Platform.OS !== "web") {
//       try {
//         const localUri = await captureRef(imageRef, {
//           height: 440,
//           quality: 1,
//         });
//         await MediaLibrary.saveToLibraryAsync(localUri);
//         if (localUri) {
//           alert("Saved!");
//         }
//       } catch (e) {
//         console.log(e);
//       }
//     } else {
//       try {
//         const dataUrl = await domtoimage.toJpeg(imageRef.current, {
//           quality: 0.95,
//           width: 320,
//           height: 440,
//         });

//         let link = document.createElement("a");
//         link.download = "sticker-smash.jpeg";
//         link.href = dataUrl;
//         link.click();
//       } catch (e) {
//         console.log(e);
//       }
//     }
//     setIsModalVisible(false);
//   };

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <View style={styles.container}>
//         <View style={styles.imageContainer}>
//           <View ref={imageRef} collapsable={false}>
//             <ImageViewer
//               placeholderImageSource={PlaceholderImage}
//               selectedImage={selectedImage}
//             />
//             {pickedEmoji && (
//               <EmojiSticker imageSize={50} stickerSource={pickedEmoji} />
//             )}
//           </View>
//         </View>
//         {showAppOptions ? (
//           <View style={styles.optionsContainer}>
//             <View style={styles.optionsRow}>
//               <IconButton icon="refresh" label="Reset" onPress={onReset} />
//               <CircleButton onPress={onAddSticker} />
//               <IconButton
//                 icon="save-alt"
//                 label="Save"
//                 onPress={onSaveImageAsync}
//               />
//             </View>
//           </View>
//         ) : (
//           <View style={styles.footerContainer}>
//             <Button
//               theme="primary"
//               label="Choose a photo"
//               onPress={pickImageAsync}
//             />
//             <Button
//               label="Use this photo"
//               onPress={() => setShowAppOptions(true)}
//             />
//           </View>
//         )}
//         <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
//           <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
//         </EmojiPicker>
//         <StatusBar style="light" />
//       </View>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#25292e",
//     alignItems: "center",
//   },
//   imageContainer: {
//     flex: 1,
//     paddingTop: 58,
//   },
//   footerContainer: {
//     flex: 1 / 3,
//     alignItems: "center",
//   },
//   optionsContainer: {
//     position: "absolute",
//     bottom: 80,
//   },
//   optionsRow: {
//     alignItems: "center",
//     flexDirection: "row",
//   },
// });
import { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    priority: "high",
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };
  console.log(message);
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    console.log(projectId);
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => setExpoPushToken(`${error}`));

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-around" }}
    >
      <Text>Your Expo push token: {expoPushToken}</Text>
      <Text>{`Channels: ${JSON.stringify(
        channels.map((c) => c.id),
        null,
        2
      )}`}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
          // await schedulePushNotification();
        }}
      />
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail hehe! 📬",
      body: "Here is the notification body",
      data: { data: "goes here", test: { test1: "more data" } },
    },
    trigger: { seconds: 1 },
  });
}
