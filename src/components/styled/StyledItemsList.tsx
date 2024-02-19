import { ReactElement } from 'react'
import { Avatar, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'

import { FileProps, FolderProps } from '../../interfaces/folder'

type Item = FolderProps | FileProps

interface ItemsListProps {
  items?: Item[]
  logo: ReactElement
  handleItemClick: (event: React.MouseEvent<HTMLElement>, item: Item) => void
}

const StyledItemsList: React.FC<ItemsListProps> = ({ items, logo, handleItemClick }) => (
  <List style={{ padding: '6rem' }}>
    {items &&
      items?.length > 0 &&
      items?.map(item => (
        <ListItemButton
          key={item.id}
          style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '0 1rem' }}
          onClick={e => handleItemClick(e, item)}
        >
          <ListItemIcon style={{ minWidth: '20px', transform: 'scale(2)' }}>{logo}</ListItemIcon>
          <ListItemIcon style={{ minWidth: '20px', transform: 'scale(1)' }}>
            {item?.permissions?.some(permission => permission.action === 'creator') &&
              item?.permissions?.map(
                permission =>
                  permission.action === 'creator' &&
                  permission.avatar && (
                    <Avatar
                      alt="Creator Avatar"
                      key={permission.avatar}
                      src={permission.avatar}
                      style={{
                        width: '20px',
                        height: '20px',
                        marginTop: '-20px',
                        position: 'absolute',
                        zIndex: '2',
                      }}
                    />
                  )
              )}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="subtitle1"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100px',
                  textAlign: 'center',
                }}
              >
                {item?.name?.length > 20 ? `${item?.name.slice(0, 20)}...` : item?.name}
              </Typography>
            }
          />
        </ListItemButton>
      ))}
  </List>
)

export default StyledItemsList
