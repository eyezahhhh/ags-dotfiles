import { Box, BoxClass, Label } from "eags";
import { Virsh } from "../service/Virsh";
import { VirtualMachine, Props as VMProps } from "./VirtualMachine";
import { cc } from "../Utils";

export interface Props {
    props?: Partial<BoxClass>
    childProps?: VMProps
    filter?: (id: string) => boolean
    className?: string
    noticeClassName?: string
}

export const VirtualMachines = (props: Props = {}) => Box({
    ...props.props,
    className: 'E-VirtualMachines' + cc(props.className, props.className),
    connections: [
        [Virsh, box => {
            let vms = Array.from(Virsh.vms.values());
            if (props.filter) {
                const filter = props.filter!;
                vms = vms.filter(vm => filter(vm.id));
            }
            // @ts-ignore
            vms.sort((a, b) => a.id.toLowerCase() > b.id.toLowerCase())

            // @ts-ignore
            box.children?.forEach(c => c.destroy());

            if (vms.length) {
                box.children = vms.map(vm => VirtualMachine(vm, props.childProps));
            } else {
                box.children = [
                    Label({
                        label: 'No virtual machines found.',
                        className: 'E-VirtualMachines-notice' + cc(props.noticeClassName, props.noticeClassName)
                    })
                ]
            }
        }]
    ]
})