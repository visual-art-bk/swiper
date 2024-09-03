import {atom} from 'recoil'
import {initialSwiperState} from './intialStates/initialSwiperState'

const Store = (() => {
    const atomToSwiper = atom({
        key:'swiper-state',
        default: initialSwiperState
    })

    return {
        getAtoms:() => ({
            atomToSwiper
        })
    }
})()

export default Store