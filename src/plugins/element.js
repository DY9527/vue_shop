import Vue from 'vue'

// import _ from 'lodash'
import {
  Cascader,
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Alert,
  TabPane,
  Tabs,
  Steps,
  Step
} from 'element-ui'
Vue.use(Step)
Vue.use(Steps)
Vue.use(Alert)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Cascader)
Vue.use(Option)
Vue.use(Select)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Col)
Vue.use(Row)
Vue.use(Card)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Header)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
// Vue.prototype._ = _
