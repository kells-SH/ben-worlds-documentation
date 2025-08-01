import { CodeBlockEvents, Component, LocalEvent, Player, PropTypes, TriggerGizmo } from 'horizon/core';

export const CollectApple = new LocalEvent<{ player: Player }>()

class Apple extends Component<typeof Apple> {
    static propsDefinition = {
        trigger: { type: PropTypes.Entity }
    };

    preStart() {
        if (!this.props.trigger) {
            console.error('Apple component requires a trigger prop');
            return;
        }

        this.connectCodeBlockEvent(this.props.trigger, CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.sendLocalBroadcastEvent(CollectApple, { player })

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
Component.register(Apple);