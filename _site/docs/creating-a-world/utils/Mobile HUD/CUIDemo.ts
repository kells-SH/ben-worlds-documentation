import * as hz from 'horizon/core';
import { Binding, Image, ImageSource, UIComponent, View } from 'horizon/ui'

class CUIDemo extends UIComponent<typeof CUIDemo> {
    protected panelHeight: number = 500;
    protected panelWidth: number = 500;
    static propsDefinition = {};
    private imageToDisplay = new Binding(ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt("2549644192052323"))))

    preStart(): void {

    }

    initializeUI() {
        return View({
            children: [
                Image({
                    source: this.imageToDisplay,
                    style: {
                        width: 200,
                        height: 200,
                        borderTopLeftRadius: 100,
                        borderTopRightRadius: 100,
                    }
                }),
                Image({
                    source: ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt("1665056164115043"))),
                    style: {
                        width: 200,
                        height: 200,
                        borderRadius: 50,
                        borderTopLeftRadius: 100,
                        borderTopRightRadius: 100,
                    }
                })
            ],
            style: {
                width: '100%',
                height: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }
        })
    }

    start() {
        const imagesToUse = [
            ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt("628422989978487"))),
            ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt("1007651621288369"))),
            ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt("2549644192052323"))),
            ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt("1308344783609988"))),
            ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt("1665056164115043"))),
        ]

        let iterator = 0
        this.async.setInterval(() => {
            this.imageToDisplay.set(imagesToUse[iterator])
            iterator = iterator + 1
            if (iterator >= imagesToUse.length) {
                iterator = 0
            }
        }, 200)
    }
}
UIComponent.register(CUIDemo);