# Design & To-do

## Structure and Framework

**Frontend** + **Backend** + **Database**

-  **frontend** : `React.js`+`webpack`
- **backend** : `django`
- **database** : `django` embedded simple sql

## To-do List

- [ ] Design and implement model of balance record *!!Requirement survey needed*.

## Design

### Models

#### BalRec

- **date** *date* Certain date required
  The date when this record is created.
- **recType** *enum(int)*
  The type of the record
  - **Possible values** : [`0-营业收入`, `1-其他收入`]
- **disType** *enum(int)*
  The way how this record is distributed among sponsors
  - **Possible values** : [`0-仅23号大院`,`1-仅175`，`2-23号大院与175(1:2)`]
- **income** *float*
- **outcome** *float*
  **INTEGRITY REQUIREMENT** there could only and must be a zero between `income` and `outcome`
- **detail** *string(255)*