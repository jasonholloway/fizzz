import Start from "../../core/Start";

export default
    (start: Start) =>
        start(x => x.load('mancCom-180720')
                    .take(1)
                    .tap(i => console.log(i))
                    .through(x.save('bonkers'))             //should return stream of keys - allows multiple partitions of course
                )
        .then((x, keys) => {
            console.info('received', keys);
        })
