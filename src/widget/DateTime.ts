import { Box, BoxClass, Label } from 'eags'
// @ts-ignore
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import { cc } from '../Utils';

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
    props?: Partial<BoxClass>
}

export const DateTime = (props: Props = {}) => Box({
    ...props.props,
    className: 'E-DateTime' + cc(props.className, props.className),
    children: [
        Label({
            className: 'E-DateTime-time' + cc(props.timeClassName, props.timeClassName),
            connections: [
                [1000, label => execAsync(['date', props.time || '+%H:%M:%S']).then((time: string) => label.label = time).catch(console.error)]
            ]
        }),
        Label({
            className: 'E-DateTime-date' + cc(props.dateClassName, props.dateClassName),
            connections: [
                [1000, label => execAsync(['date', props.date || '+%b %-d']).then((date: string) => label.label = date).catch(console.error)]
            ]
        })
    ]
})