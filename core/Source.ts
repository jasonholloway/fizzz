import Stream from '../core/Stream'

interface Source {
    run(): Stream<any>
}

export default Source;