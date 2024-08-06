import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export default function EmojiSticker({ imageSize, stickerSource }) {
  const scaleImage = useSharedValue(imageSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value !== imageSize * 4) {
        scaleImage.value = scaleImage.value * 2;
      }
    });

  const drag = Gesture.Pan().onChange((event) => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const composedGestures = Gesture.Race(drag, doubleTap);

  return (
    <GestureDetector gesture={composedGestures}>
      <Animated.Image
        source={stickerSource}
        contentFit="contain"
        style={[
          imageStyle,
          containerStyle,
          {
            top: -350,
            width: imageSize,
            height: imageSize,
          },
        ]}
      />
    </GestureDetector>
  );

  return (
    <GestureDetector gesture={drag}>
      <Animated.View
        style={[
          containerStyle,
          { top: -350, width: "auto", borderWidth: 2, borderColor: "black" },
        ]}
      >
        <GestureDetector gesture={doubleTap}>
          <Animated.Image
            source={stickerSource}
            contentFit="contain"
            style={[
              imageStyle,
              {
                width: imageSize,
                height: imageSize,
                borderWidth: 2,
                borderColor: "black",
              },
            ]}
          />
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}
