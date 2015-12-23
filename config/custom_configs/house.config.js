/**
 * This config is extremely important. It is what sets up your whole house.
 * The first time you run the app, it will save this file into a Schema in mongoDB. So,
 * make sure that it is how you want it before you run it. (You can fix it later if
 * you mess up with the load_new flag on main config)
 *
 * This is my setup. Try not to go more than 2 descriptions deep.
 * So max would be: bedroom.lamp. You can add deeper but you are going to
 * have to change a ton of code.
 *
 * The type sets what it is. I only have radio controlled outlets and milight bulbs so that
 * is what it is set for. If you want to add more rules and devices, be my guest.
 * Box/Radio number indicates which box it will use (in the boxes array in lights.config/radio.config) and the zone
 * indicates what zone on the box to set it to. Radio is controlled by radio
 * codes. I use radio controlled outlets and use a 433hz transmitter to send it.
 * Use something like rfoutlet to capture the code. There are tutorials on it.
 *
 * Volume is for playing Google music on a Linux box. I set the default to 50 because
 * that is a decent volume. That is more of a filler since the starting volume
 * will be whatever your computer is currently at.
 *
 *
 * TODO: Allow more than 2 layers deep
 *
 * @type {{bedroom: {hall: {on: boolean, type: string, color: number, brightness: number, zoneNumber: number, boxNumber: number}, lamp: {on: boolean, type: string, color: number, brightness: number, zoneNumber: number, boxNumber: number}}, livingRoom: {overhead: {on: boolean, type: string, color: number, brightness: number, zoneNumber: number, boxNumber: number}, recess: {on: boolean, type: string, color: number, brightness: number, zoneNumber: number, boxNumber: number}}, kitchen: {overhead: {on: boolean, type: string, color: number, brightness: number, zoneNumber: number, boxNumber: number}, counter: {on: boolean, type: string, color: number, brightness: number, zoneNumber: number, boxNumber: number}, foyer: {on: boolean, type: string, color: number, brightness: number, zoneNumber: number, boxNumber: number}, coffee: {on: boolean, type: string, code_on: string, code_off: string}}, hall: {main: {on: boolean, type: string, color: number, brightness: number, zoneNumber: number, boxNumber: number}}, misc: {christmas: {on: boolean, type: string, code_on: string, code_off: string}}, volume: number}}
 */

module.exports = {
    bedroom: {
        hall: {
            on: 'false', /*Is it on? Has to be a string or it will evaluate random things*/
            type: 'light', /*What kind of object is it? Only have radio and light */
            color: 0, /*MiLight color. I start it at the bottom */
            brightness: 100, /* MiLight brightness, start it at the top */
            zoneNumber: 1, /*Zone number of the MiLight bulb. 1-4 */
            boxNumber: 0, /*What box is it from lights.config.js, remember it starts at 0 */
            folderButton: true /*Is it a button that goes in a folder? */
        },
        lamp: {
            on: 'false',
            type: 'light',
            color: 0,
            brightness: 100,
            zoneNumber: 3,
            boxNumber: 0,
            folderButton: true
        }
    },
    livingRoom: {
        overhead: {
            on: 'false',
            type: 'light',
            color: 0,
            brightness: 100,
            zoneNumber: 1,
            boxNumber: 1,
            folderButton: true
        },
        recess: {
            on: 'false',
            type: 'light',
            color: 0,
            brightness: 100,
            zoneNumber: 2,
            boxNumber: 1,
            folderButton: true
        }

    },
    kitchen: {
        overhead: {
            on: 'false',
            type: 'light',
            color: 0,
            brightness: 100,
            zoneNumber: 1,
            boxNumber: 2,
            folderButton: true
        },
        counter: {
            on: 'false',
            type: 'light',
            color: 0,
            brightness: 100,
            zoneNumber: 2,
            boxNumber: 2,
            folderButton: true
        },
        foyer: {
            on: 'false',
            type: 'light',
            color: 0,
            brightness: 100,
            zoneNumber: 3,
            boxNumber: 2,
            folderButton: true
        },
        coffee: {
            on: 'false',
            type: 'radio',
            radioNumber: 0,
            code_on: '1120003',
            code_off: '1120012',
            folderButton: false

        }
    },
    hall: {
        main: {
            on: 'false',
            type: 'light',
            color: 0,
            brightness: 100,
            zoneNumber: 2,
            boxNumber: 0,
            folderButton: true
        }
    },
    misc: {
        christmas: {
            on: 'false',
            type: 'radio',
            radioNumber: 0, /*Same as box number, what number is it from radio.config.js */
            code_on: '1121539', /*Radio code for turning it on */
            code_off: '1121548', /*Radio code for turning it off */
            folderButton: false
        }
    },
    volume: 50
}