import * as hz from 'horizon/core';
import { AnimatedBinding, Animation, Binding, Easing, Image, ImageSource, Pressable, UIComponent, UINode, View } from 'horizon/ui';

class USMapUI extends UIComponent<typeof USMapUI> {
    protected panelHeight: number = 600;
    protected panelWidth: number = 800;
    static propsDefinition = {};
    private minX = -1560;
    private minY = -980;
    private moveDirections = {
        x: 0,
        y: 0
    }
    private currentX = -1560;
    private currentY = -400;
    private bindXTranslation = new AnimatedBinding(-1560);
    private bindYTranslation = new AnimatedBinding(-400);

    initializeUI(): UINode {
        return View({
            children: [
                Image({ // This is the image to be displayed
                    source: ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt("523982667073411"))),
                    style: {
                        borderRadius: 30,
                        borderWidth: 10,
                        width: '300%',
                        aspectRatio: 1.5,
                        transform: [
                            { translateX: this.bindXTranslation },
                            { translateY: this.bindYTranslation },
                        ]
                    }
                }),
                View({ // This is the container for the navigation buttons
                    children: [
                        View({
                            children: [
                                Pressable({ // To go up
                                    onPress: () => this.moveMap(0, -1),
                                    onRelease: () => this.moveMap(0, 0),
                                    style: {
                                        height: '100%',
                                        aspectRatio: 1,
                                        backgroundColor: 'purple',
                                    }
                                })
                            ],
                            style: {
                                width: 300,
                                height: 100,
                                alignItems: 'center'
                            }
                        }),
                        View({
                            children: [
                                Pressable({ // To go left
                                    onPress: () => this.moveMap(-1, 0),
                                    onRelease: () => this.moveMap(0, 0),
                                    style: {
                                        height: '100%',
                                        aspectRatio: 1,
                                        backgroundColor: 'purple',
                                    }
                                }),
                                Pressable({ // To go right
                                    onPress: () => this.moveMap(1, 0),
                                    onRelease: () => this.moveMap(0, 0),
                                    style: {
                                        height: '100%',
                                        aspectRatio: 1,
                                        backgroundColor: 'purple',

                                    }
                                })
                            ],
                            style: {
                                width: 300,
                                height: 100,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }
                        }),
                        View({
                            children: [
                                Pressable({ // To go down
                                    onPress: () => this.moveMap(0, 1),
                                    onRelease: () => this.moveMap(0, 0),
                                    style: {
                                        height: '100%',
                                        aspectRatio: 1,
                                        backgroundColor: 'purple',
                                    }
                                })
                            ],
                            style: {
                                width: 300,
                                height: 100,
                                alignItems: 'center'
                            }
                        }),
                    ],
                    style: {
                        width: 300,
                        height: 300,
                        position: 'absolute',
                        opacity: 0.5,
                    }
                }),

            ],
            style: {
                width: '100%',
                height: '100%',
                flexDirection: 'row',
                borderColor: 'black',
                borderWidth: 3,
                borderRadius: 30,
                backgroundClip: 'padding-box'
            }
        })
    }

    start() {

    }

    private moveMap(x: number, y: number) {
        this.moveDirections.x = x * -1
        this.moveDirections.y = y * -1

        console.log(this.moveDirections)
        this.currentX = hz.clamp(this.currentX + this.moveDirections.x * 50, this.minX, 0);
        this.currentY = hz.clamp(this.currentY + this.moveDirections.y * 50, this.minY, 0);

        console.log(this.currentX, this.currentY)
        if (this.moveDirections.x !== 0) {
            this.bindXTranslation.set(Animation.timing(this.currentX, { duration: 100 }))
        } else if (this.moveDirections.y !== 0) {
            this.bindYTranslation.set(Animation.timing(this.currentY, { duration: 100 }))
        }
    }
}
UIComponent.register(USMapUI);