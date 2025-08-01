import { CodeBlockEvents, Component, LocalEvent, Player, PropTypes, TriggerGizmo } from 'horizon/core';

export const CollectedCoin = new LocalEvent<{ player: Player }>()

class Coin extends Component<typeof Coin> {
    static propsDefinition = {
        trigger: { type: PropTypes.Entity }
    };

    preStart() {
        if (!this.props.trigger) {
            console.error('Coin component requires a trigger prop');
            return;
        }

        this.connectCodeBlockEvent(this.props.trigger, CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.sendLocalBroadcastEvent(CollectedCoin, { player })

            this.props.trigger?.as(TriggerGizmo).enabled.set(false);
            this.entity.visible.set(false);

            this.async.setTimeout(() => {
                this.props.trigger?.as(TriggerGizmo).enabled.set(true);
                this.entity.visible.set(true);
            }, 5_000);
        })
    }

    start() {

    }
}
Component.register(Coin);