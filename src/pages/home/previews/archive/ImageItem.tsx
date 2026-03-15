import { Center, VStack } from "@hope-ui/solid"
import { Motion } from "solid-motionone"
import { useContextMenu } from "solid-contextmenu"
import { batch } from "solid-js"
import { CenterLoading, ImageWithError } from "~/components"
import { useLink, usePath, useUtil } from "~/hooks"
import { getMainColor, objStore, selectIndex } from "~/store"
import { ObjType, StoreObj } from "~/types"
import { bus } from "~/utils"

export const ImageItem = (props: {
  obj: StoreObj
  index: number
  callback: () => void
}) => {
  const { isHide } = useUtil()
  if (isHide(props.obj) || props.obj.type !== ObjType.IMAGE) {
    return null
  }
  const { setPathAs } = usePath()
  const { show } = useContextMenu({ id: 1 })
  const { rawLink } = useLink()
  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        "flex-grow": 1,
      }}
    >
      <VStack
        w="$full"
        classList={{ selected: !!props.obj.selected }}
        class="image-item viselect-item"
        data-index={props.index}
        p="$1"
        spacing="$1"
        rounded="$lg"
        transition="all 0.3s"
        border="2px solid transparent"
        _hover={{
          border: `2px solid ${getMainColor()}`,
        }}
        onMouseEnter={() => {
          setPathAs(props.obj.name, props.obj.is_dir, true)
        }}
        onContextMenu={(e: MouseEvent) => {
          batch(() => {
            selectIndex(props.index, true, true)
          })
          show(e, { props: props.obj })
        }}
      >
        <Center w="$full" pos="relative">
          <ImageWithError
            h="150px"
            w="$full"
            objectFit="cover"
            rounded="$lg"
            shadow="$md"
            fallback={<CenterLoading size="lg" />}
            src={rawLink(props.obj)}
            loading="lazy"
            on:click={() => {
              props.callback()
            }}
          />
        </Center>
      </VStack>
    </Motion.div>
  )
}
