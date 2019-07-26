import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

const notesApi = 'https://a.wunderlist.com/api/v1/notes';

class Notes extends Component {
    //The Notes component allows the user to jot down notes that pertain to that particular Notebook
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            showButton: false
        }
    }

    componentDidMount() {
        this.fetchNotes();
    }

    async fetchNotes() {
        let listId = 398871490;
        let options = this.props.getRequestOptions('GET');
        const newState = {};

        console.log(`Fetching all notes for list ${this.state.parentListId}`);
        return this.props.callWunderlistApi(`${notesApi}?list_id=${listId}`, options)
            .then(response => {
                console.log('notes: ', response);
                this.setState({ notes: response });
                response.forEach(note => {
                    newState[note.task_id] = note.content;
                });

                this.setState(newState);
            });
    }

    handleNoteChange = (taskId, e) => {
        this.setState({[taskId]: e.target.value});
    }

    createUpdateNote(taskId, event) {
        //TODO: this only works currently while creating new notes.
        //Update to PATCH existing notes.
        event.preventDefault();
        console.log(`Creating the following note: `, this.state[taskId]);

        let options = this.props.getRequestOptions('POST');
        options.body = JSON.stringify({ task_id: parseInt(taskId), content: this.state[taskId] });

        this.props.callWunderlistApi(notesApi, options) 
            .then(() => {
                this.fetchNotes();
            })
            .catch(() => {
                console.log(`Something went wrong while trying to create a note.`);
            });

        console.log(`Note with parent task ${taskId} saved!`);
        this.setState({ showButton: false });
    }

    render() {
        return (
            <form 
                onSubmit={(event) => this.createUpdateNote(this.props.task.id, event)} 
                onInput={() => this.setState({ showButton: true })}>
                <span>
                    <span onClick={() => this.props.deleteTask(this.props.task.id, this.props.task.revision)}>
                        <FontAwesomeIcon icon={faWindowClose} className='close' />
                    </span>
                    <h1 className='title text-muted'>
                        {this.props.task.title}
                    </h1>
                    <textarea id="page" cols="30" rows="10" placeholder="well...start note taking" 
                        value={this.state[this.props.task.id]} 
                        onChange={(event) => this.handleNoteChange(this.props.task.id, event)}>
                    </textarea>
                    {/* {this.renderNote(this.props.task.id)} */}
                </span>
                {
                    this.state.showButton ?
                    <button type='submit' className='btn btn-primary'>Save</button>
                    : null
                }
            </form>
        )
    }
}

export default Notes;