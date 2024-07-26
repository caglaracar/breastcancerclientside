import React, { useMemo, useState, useEffect } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';

// Modal için root elementi ayarla
Modal.setAppElement('#root');

function UserTable() {
    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get('https://45.147.46.202:443/api/user/all');
                setData(result.data);
            } catch (ex) {
                console.error(ex);
            }
        };
        fetchData();
    }, []);

    const columns = useMemo(() => [
        { Header: 'Adı', accessor: 'securityUser.username' },
        { Header: 'Soyadı', accessor: 'surname' },
        { Header: 'E-posta', accessor: 'email' },
        { Header: 'Yaş', accessor: 'age' },
        { Header: 'Kilo', accessor: 'weight' },
        { Header: 'Boy', accessor: 'height' },
        { Header: 'Bölge', accessor: 'generalAnlysisRegion' },
    ], []);

    function flattenUserData(users) {
        const flattenedData = [];

        users.forEach(user => {
            if (user.exercise.length === 0) {
                flattenedData.push({ ...user, exerciseName: '', calories: '', difficultyLevel: '', steps: '' });
            } else {
                user.exercise.forEach(ex => {
                    flattenedData.push({
                        ...user,
                        exerciseDate: ex.exerciseDate,
                        exerciseName: ex.exerciseName,
                        calories: ex.calories,
                        testResult:ex.testResult,
                        difficultyLevel: ex.difficultyLevel,
                        steps: ex.step?.reduce((acc, item) => acc + item.steps, 0) || 0
                    });
                });
            }
        });

        return flattenedData;
    }



    const tableInstance = useTable({ columns, data });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    const openModal = (user) => {
        setSelectedUser(user);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };


    function exportToExcel(data, fileName) {
        const flattenedData = flattenUserData(data); // Düzleştirme işlemi
        const worksheet = XLSX.utils.json_to_sheet(flattenedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }

    const handleExport = () => {
        exportToExcel(data, "User_Data");
    }
    return (
        <div style={{overflowX: 'auto',overflowY:"auto"}}>
            <table {...getTableProps()} style={{width: '100%', borderCollapse: 'collapse',overflowY:"auto"}}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()} style={{
                                borderBottom: 'solid 3px red',
                                background: 'aliceblue',
                                color: 'black',
                                fontWeight: 'bold',
                                padding: '10px',
                                textAlign: 'left'
                            }}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr style={{cursor: "pointer"}} {...row.getRowProps({
                            onClick: () => openModal(row.original)
                        })}>
                            {row.cells.map(cell => {
                                return (
                                    <td
                                        {...cell.getCellProps()}
                                        className="rov-hover"
                                        style={{padding: '10px', border: 'solid 1px gray', background: 'papayawhip'}}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'aliceblue'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'papayawhip'}
                                    >
                                        {cell.render('Cell')}
                                    </td>

                                );
                            })}
                        </tr>

                    );
                })}
                </tbody>
            </table>

            <div style={{marginTop:'30px',marginBottom:"30px"}}>
                <button style={{padding:"10px",marginBottom:"20px"}} onClick={handleExport}>Excel İNDİR!</button>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Exercise Details"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }
                }}
            >
                <h2>{selectedUser?.name} Kişisi İçin Egzersiz Detayları</h2>
                <ul style={{padding: '10px', border: 'solid 1px gray', background: 'beige', overflowY: "auto"}}>
                    {selectedUser?.exercise.map((ex) => (
                        <li key={ex.id} className="exercise-item">
                            <span>Tarih: {new Date(ex.exerciseDate).toLocaleString()}</span>
                            <span>Egzersiz Adı: {ex.exerciseName}</span>
                            <span>Kalori: {ex.calories}</span>
                            <span>Test Sonucu: {ex.testResult}</span>
                            <span>Zorluk Seviyesi: {ex.difficultyLevel}</span>
                            <span>Adım Sayısı: {ex.step?.reduce((acc, item) => acc + item.steps, 0) || 0}</span>
                        </li>
                    ))}
                </ul>


                <button>
                    Kapat
                </button>

            </Modal>
        </div>
    );
}

export default UserTable;
