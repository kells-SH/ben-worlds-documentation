import { Pressable, Text, UIComponent, UINode, View } from "horizon/ui";


class BlockingCUI extends UIComponent<typeof BlockingCUI> {
    static propsDefinition = {};

    initializeUI(): UINode {
        return View({
            children: [
                Pressable({
                    children: [
                        Text({
                            text: "Click me",
                            style: {
                                color: '#ffffff',
                                fontSize: 40,
                                padding: 10,
                                borderRadius: 5,
                                width: '100%',
                                height: '100%',
                                textAlignVertical: 'center',
                                textAlign: 'center',
                            }
                        })
                    ],
                    onPress: () => {
                        this.entity.visible.set(false)
                        console.log("Button Pressed")
                    },
                    style: {
                        width: 200,
                        height: 200,
                        borderRadius: 5,
                        backgroundColor: '#eb5e13',
                    }
                })
            ],
            style: {
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                width: '100%',
                height: '100%',
            }
        })
    }
}
UIComponent.register(BlockingCUI);