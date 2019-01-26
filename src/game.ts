import { getProvider } from '@decentraland/web3-provider'
import * as EthConnect from '../node_modules/eth-connect/esm'

import abi from './rainbow'

function colourNameToHex(colour)
{
    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];

    return false;
}

@Component('lerpData')
export class LerpData {
  oldPos: Vector3 = Vector3.Zero()
  nextPos: Vector3 = Vector3.Zero()
  fraction: number = 0
  pause: number = 0
  constructor(oldPos: Vector3, nextPos: Vector3, fraction: number,  pause: number){
    this.oldPos = oldPos
    this.nextPos = nextPos
    this.fraction = fraction
    this.pause = pause
  }
}


class RotatorSystem {
  // this group will contain every entity that has a Transform component
  group = engine.getComponentGroup(Transform)
  // engine.getComponentGroup(LerpData)


  update(dt: number) {
    // iterate over the entities of the group
    for (let entity of this.group.entities) {
      // get the Transform component of the entity
      const transform = entity.get(Transform)

      // mutate the rotation
      transform.rotate(Vector3.Up(), dt * 10)

        let lerp = entity.get(LerpData)
        if (lerp.fraction < 1) {
          transform.position = Vector3.Lerp(lerp.oldPos, lerp.nextPos, lerp.fraction)
          lerp.fraction += 1/50
        } else if (lerp.pause > 0) {
          lerp.pause -= 3
        } else {
          log("new position")
          lerp.oldPos = transform.position
          // new random position
          lerp.nextPos.x = Math.random() * 10
          lerp.nextPos.y = (Math.random() * 3) + 1
          lerp.nextPos.z = Math.random() * 10
          lerp.fraction = 0
          lerp.pause = Math.random() * 500
          // face new position
          transform.lookAt(lerp.nextPos)
        }
      }
    }
  }
}

executeTask(async () => {
  // create an instance of the web3 provider to interface with Metamask
  const provider = await getProvider()
  // Create the object that will handle the sending and receiving of RPC messages
  const requestManager = new EthConnect.RequestManager(provider)
  // Create a factory object based on the abi
  const factory = new EthConnect.ContractFactory(requestManager, abi)
  // Use the factory object to instance a `contract` object, referencing a specific contract
  const rainbow = (await factory.at(
    '0x75b928c02c7d57957d862f041c741baacf5aee6d'
  )) as any

  const totalSupply = await rainbow.totalSupply()
  const colors = []
  for (let i = 0; i < totalSupply; i++) {
    const color = await rainbow.getColor(i)
    // if (isInvalidColor(normalizedColor)) {
    //   continue
    // }

    spawnCube(5, 1, 5, color.replace(';', ''))
  }

  // console.log(colors)
})

// Add a new instance of the system to the engine
engine.addSystem(new RotatorSystem())

/// --- Spawner function ---

function spawnCube(x: number, y: number, z: number, color: string) {
  let colorHexa = color
  if (color.indexOf('#') === -1) {
    colorHexa = colourNameToHex(color)
    if (!colorHexa) return
  }

  // create the entity
  const cube = new Entity()

  // set a transform to the entity
  cube.set(new Transform({ position: new Vector3(x, y, z) }))

  // set a shape to the entity
  cube.set(new BoxShape())
  // console.log(Color3.FromHexString(`#${intToRGB(hashCode(color))}`))
  const myMaterial = new Material()

  const cubeColor = Color3.FromHexString(colorHexa)
  // Configure component
  myMaterial.albedoColor = cubeColor

  cube.add(myMaterial)
  const startPosition = new Vector3(4, 2, 8)
  const nextPos = new Vector3(Math.random() * 10 ,Math.random() * 5 ,Math.random() * 10)

  cube.add(new LerpData(startPosition, nextPos, 0, 200))

  cube.get(Transform).lookAt(nextPos)

  // add the entity to the engine
  engine.addEntity(cube)

  return cube
}

/// --- Spawn a cube ---

// const cube = spawnCube(5, 1, 5)

// cube.set(
//   new OnClick(() => {
//     cube.get(Transform).scale.z *= 1.1
//     cube.get(Transform).scale.x *= 0.9

//     spawnCube(Math.random() * 8 + 1, Math.random() * 8, Math.random() * 8 + 1)
//   })
// )
