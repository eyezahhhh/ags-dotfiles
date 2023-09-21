import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import { dcc } from '../Utils';
import { Box, BoxArgs, Label } from 'resource:///com/github/Aylur/ags/widget.js';

/*
    box
      .E-DateTime
      .<className> {
        label
          .E-DateTime-time
          .<timeClassName> {}
        label
          .E-DateTime-date
          .<dateClassName> {}
    }
*/

export interface Props {
    date?: string
    time?: string
    className?: string
    dateClassName?: string
    timeClassName?: string
    props?: Partial<BoxArgs>
}

export const DateTime = (props: Props = {}) => Box({
    ...props.props,
    className: 'E-DateTime' + dcc(props.className),
    children: [
        Label({
            className: 'E-DateTime-time' + dcc(props.timeClassName),
            connections: [
                [1000, label => execAsync(['date', props.time || '+%H:%M:%S']).then((time: string) => label.label = time).catch(console.error)]
            ]
        }),
        Label({
            className: 'E-DateTime-date' + dcc(props.dateClassName),
            connections: [
                [1000, label => execAsync(['date', props.date || '+%b %-d']).then((date: string) => label.label = date).catch(console.error)]
            ]
        })
    ]
})