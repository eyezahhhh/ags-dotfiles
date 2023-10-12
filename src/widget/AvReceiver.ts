import { Box, Button, Label, LabelType } from 'resource:///com/github/Aylur/ags/widget.js';
import '../service/Avr';
import { Avr, AvrInput } from '../service/Avr';
import { cc } from '../Utils';
import { SimpleButton } from './SimpleButton';

export interface Props {
    inputs: Record<AvrInput, string>
}

export const AvReceiver = (props: Props) => Box({
    vertical: true,
    className: 'E-AvReceiver',
    children: [
        Box({
            children: [
                SimpleButton({
                    label: '',
                    props: {
                        connections: [
                            [Avr, button => {
                                if ((button.child as LabelType).label == '') {
                                    button.className = 'E-SimpleButton E-AvReceiver-power' + cc(Avr.getStatus()?.on, 'E-AvReceiver-power-on');
                                }
                            }]
                        ],
                        onClicked: async button => {
                            try {
                                button.label = '';
                                button.className = 'E-SimpleButton E-AvReceiver-power';
                                await Avr.setPower(!Avr.getStatus()?.on);
                            } catch {}
                            button.label = '';
                            button.className = 'E-SimpleButton E-AvReceiver-power' + cc(Avr.getStatus()?.on, 'E-AvReceiver-power-on');
                        }
                    }
                }),
                SimpleButton({
                    label: '',
                    props: {
                        connections: [
                            [Avr, button => {
                                if ((button.child as LabelType).label != '') {
                                    button.className = 'E-SimpleButton E-AvReceiver-dimmer' + cc(Avr.getStatus()?.dimmerLevel != 'shut-off', 'E-AvReceiver-dimmer-on');
                                }
                            }]
                        ],
                        onClicked: async button => {
                            try {
                                button.label = '';
                                button.className = 'E-SimpleButton E-AvReceiver-dimmer';
                                await Avr.setDimmerLevel(Avr.getStatus()?.dimmerLevel == 'shut-off' ? 'bright' : 'shut-off');
                            } catch {}
                            button.label = '';
                            button.className = 'E-SimpleButton E-AvReceiver-dimmer' + cc(Avr.getStatus()?.dimmerLevel != 'shut-off', 'E-AvReceiver-dimmer-on');
                        }
                    }
                })
            ]
        }),
        Box({
            vertical: true,
            children: Object.entries(props.inputs).map(([id, name]) => {
                return Button({
                    className: 'E-Button E-AvReceiver-input',
                    child: Box({
                        halign: 'center',
                        children: [
                            Label({
                                label: name
                            })
                        ]
                    }),
                    connections: [
                        [Avr, box => {
                            const selected = Avr.getStatus().input == id;
                            box.className = 'E-Button E-AvReceiver-input' + cc(selected, 'E-AvReceiver-input-selected');
                        }]
                    ],
                    onClicked: async button => {
                        button.child = Box({
                            halign: 'center',
                            children: [
                                Label({
                                    label: ''
                                })
                            ]
                        });
                        await Avr.setInput(id as AvrInput);
                        button.child = Box({
                            halign: 'center',
                            children: [
                                Label({
                                    label: name
                                })
                            ]
                        });
                    }
                })
            })
        })
    ]
});