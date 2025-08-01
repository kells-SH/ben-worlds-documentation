import { CollectApple } from 'Apple';
import { CollectedCoin } from 'Coin';
import { CodeBlockEvents, clamp, Player, PlayerDeviceType, TextureAsset } from 'horizon/core';
import { UIComponent, Text, View, Binding, Image, ImageSource, AnimatedBinding, Animation } from 'horizon/ui';

class PlayerHUD extends UIComponent<typeof PlayerHUD> {
    protected panelWidth: number = 800;
    protected panelHeight: number = 600;
    static propsDefinition = {};
    private bindCoins = new Binding('0')
    private bindHealth = new Binding('100%')
    private playerData = new Map<Player, { coin: number }>()
    private healthData = new Map<Player, { health: number }>()
    private iconSize = new AnimatedBinding(40)

    override initializeUI() {

        // Include this in the projectile gizmo
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnProjectileHitPlayer, (player, position, normal, headshot) => {
            if (headshot) {
                // send event with -50 damage
            } else {
                // send event with -10 damage
            }
        })
        return View({
            children: [
                View({ // Top Bar
                    children: [
                        View({ // icon
                            style: {
                                height: '100%',
                                aspectRatio: 1,
                                backgroundColor: '#f92222',
                                borderRadius: 12,
                            }
                        }),
                        View({ // meter
                            children: [
                                View({
                                    style: {
                                        height: '100%',
                                        width: this.bindHealth,
                                        backgroundColor: '#e0b2b2',
                                        borderTopRightRadius: 12,
                                        borderBottomRightRadius: 12,
                                    }
                                })
                            ],
                            style: {
                                height: '50%',
                                width: 300,
                                backgroundColor: '#f92222',
                                borderTopRightRadius: 12,
                                borderBottomRightRadius: 12,
                                padding: 2
                            }
                        }),
                        View({ // icon
                            children: [
                                Image({
                                    source: ImageSource.fromTextureAsset(new TextureAsset(BigInt("4000497600233774"))),
                                    style: {
                                        width: this.iconSize,
                                        aspectRatio: 1,
                                    }
                                })
                            ],
                            style: {
                                height: '100%',
                                aspectRatio: 1,
                                backgroundColor: '#f4c93d',
                                borderRadius: 12,
                                zIndex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignContent: 'center',
                            }
                        }),
                        View({ // Coins
                            children: [
                                Text({
                                    text: this.bindCoins,
                                    style: {
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: '#e0b2b2',
                                        borderTopRightRadius: 12,
                                        borderBottomRightRadius: 12,
                                        color: '#000000',
                                        fontSize: 24,
                                        textAlign: 'right',
                                        textAlignVertical: 'center',
                                        paddingRight: 10
                                    }
                                })
                            ],
                            style: {
                                height: '50%',
                                width: 150,
                                backgroundColor: '#f4c93d',
                                borderTopRightRadius: 12,
                                borderBottomRightRadius: 12,
                                padding: 2
                            }
                        }),
                    ],
                    style: {
                        width: '100%',
                        height: 60,
                        // backgroundColor: '#000000',
                        marginTop: 20,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                    }
                })
            ],
            style: {
                width: '100%',
                height: '100%',
            }
        })
    }

    override start() {
        this.async.setInterval(() => {
            this.healthData.forEach((data, player) => {
                this.adjustHealth(player, -10)
            })
        }, 1_000)
    }

    private adjustHealth(player: Player, value: number) {
        if (!this.healthData.has(player)) {
            this.healthData.set(player, { health: 100 })
        }

        const health = this.healthData.get(player)?.health || 100
        const updateHealth = clamp(health + value, 0, 100)
        console.log("Health: ", updateHealth)
        this.healthData.set(player, { health: updateHealth })
        this.bindHealth.set(updateHealth.toString() + "%", [player])

        if (updateHealth === 0) {
            // player.playAvatarGripPoseAnimationByName('Die')

            this.async.setTimeout(() => {
                // player.playAvatarGripPoseAnimationByName('Respawn')
                this.adjustHealth(player, 100)
            }, 2_000)
        }
    }

    override preStart() {
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            this.healthData.set(player, { health: 100 })
            this.bindHealth.set('100%')
            this.bindCoins.set('0')

            if (player.deviceType.get() === PlayerDeviceType.Desktop) {
                // Display or hide the hud
            } else if (player.deviceType.get() === PlayerDeviceType.Mobile) {
                // Display or hide the hud
            } else {
                // Display or hide the hud
            }
        })

        this.connectLocalBroadcastEvent(CollectedCoin, ({ player }) => {
            if (!this.playerData.has(player)) {
                this.playerData.set(player, { coin: 0 })
            }

            this.iconSize.set(Animation.timing(60, { duration: 1 }), (finished) => {
                if (finished) {
                    this.iconSize.set(Animation.timing(40, { duration: 1 }))
                }
            })

            const coins = this.playerData.get(player)?.coin || 0
            const updatedCoins = coins + 1
            this.playerData.set(player, { coin: updatedCoins })
            this.bindCoins.set(updatedCoins.toString(), [player])
        })


        this.connectLocalBroadcastEvent(CollectApple, ({ player }) => {
            this.adjustHealth(player, 40)

            // to change the avatar 
            //player.avatarScale.set( 5 )
        })
    }
}
UIComponent.register(PlayerHUD);